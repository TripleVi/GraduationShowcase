import { Op, where } from 'sequelize'

import db from '../models'
import * as storageService from './storage-service'

// async function getProjects() {
//     const projects = await db.Project.findAll({
//         attributes: { exclude: ['topicId', 'createdAt', 'updatedAt'] },
//         include: [
//             {
//                 model: db.Author,
//                 attributes: { exclude: ['createdAt', 'updatedAt', 'projectId'] },
//             },
//             {
//                 model: db.Hashtag,
//                 through: { attributes: [] },
//             },
//             {
//                 model: db.Photo,
//                 attributes: { exclude: ['projectId'] },
//             },
//             {
//                 model: db.Report,
//                 attributes: { exclude: ['projectId'] },
//             },
//         ],
//     })
//     return projects.map(p => {
//         const values = p.dataValues
//         values.hashtags = values.hashtags.map(h => h.name)
//         return values
//     })
// }

async function getProjects() {
    // projects/1/files
    // authors
    // projects/1
    // authors : PUT
    const projects = await db.Author.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        // include: [
        //     {
        //         model: db.Photo,
        //         attributes: ['id'],
        //         include: [
        //             {
        //                 model: db.File,
        //                 required: true,
        //             }
        //         ]
        //     },
        // ],
    })

    return projects
}

async function addProject(project, files) {
    const { hashtags, authors, ...newProject } = project
    const { report, photos, avatars } = files
    const allFiles = [...report, ...avatars, ...photos]

    const topic = await db.Topic.findByPk(newProject.topicId)
    if(!topic) {
        throw { code: 'TOPIC_NOT_EXIST' }
    }
    const authorEmails = authors.map(a => a.email)
    const count = await db.Author.count({
        where: { email: { [Op.or]: authorEmails } },
    })
    if(count) {
        throw { code: 'EMAIL_EXISTS' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const newFiles = []
        const filepaths = []
        for (const f of allFiles) {
            newFiles.push({
                name: f.filename,
                originalName: f.originalname,
                size: f.size,
                mimeType: f.mimetype,
            })
            filepaths.push(f.path)
        }
        const responses = await storageService.uploadFilesFromLocal(filepaths)
        responses.forEach((res, i) => newFiles[i].url = res[0].metadata.selfLink)
        
        const filePromises = []
        for (const f of newFiles) {
            filePromises.push(db.File.create(f))
        }
        const fileResults = await Promise.all(filePromises)
        const fileIds = fileResults.map(r => r.dataValues.id)

        let index = 0
        newProject.reportId = fileIds[index++]
        const projectResult = await db.Project.create(newProject, { transaction })
        const projectId = projectResult.dataValues.id
        const existingHashtags = await db.Hashtag.findAll({
            where: { name: { [Op.or]: hashtags } },
            raw: true,
            transaction,
        })
        const names = existingHashtags.map(h => h.name)
        const hashtagPromises = []
        for (const name of hashtags) {
            if(!names.includes(name)) {
                hashtagPromises.push(
                    db.Hashtag.create({ name }, { transaction })
                )
            }
        }
        const hashtagResults = await Promise.all(hashtagPromises)
        const hashtagIds = hashtagResults.map(r => r.dataValues.id)
        
        const projectHashtagPromises = []
        for (const hashtagId of hashtagIds) {
            const values = { projectId, hashtagId }
            projectHashtagPromises.push(
                db.ProjectHashtag.create(values, { transaction })
            )
        }

        const authorPromises = []
        for (const a of authors) {
            const { fileIndex, ...values } = a
            values.projectId = projectId
            if(typeof fileIndex == 'number') {
                values.avatarId = fileIds[fileIndex+index]
            }
            authorPromises.push(
                db.Author.create(values, { transaction })
            )
        }
        index += avatars.length

        const photoPromises = []
        while (index < fileIds.length) {
            const values = { projectId, fileId: fileIds[index++] }
            photoPromises.push(
                db.Photo.create(values, { transaction })
            )
        }

        await Promise.all(projectHashtagPromises)
        await Promise.all(authorPromises)
        await Promise.all(photoPromises)
        
        await transaction.commit()
        return newProject
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function updateProject(id, project) {
    const currentProject = await db.Project.findByPk(id)
    if(!currentProject) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const { hashtags, ...values } = project
    const transaction = await db.sequelize.transaction()
    try {
        await currentProject.setHashtags([], { transaction })
        const currentHashtags = await db.Hashtag.findAll({
            where: { name: { [Op.or]: hashtags } },
            transaction,
        })
        const hashtagPromises = []
        if(currentHashtags.length) {
            hashtagPromises.push(
                currentProject.setHashtags(currentHashtags, { transaction })
            )
        }
        const names = currentHashtags.map(h => h.name)
        for (const h of hashtags) {
            if(!names.includes(h)) {
                hashtagPromises.push(
                    currentProject.createHashtag(h, { transaction })
                )
            }
        }
        await currentProject.update(values, { transaction })
        await Promise.all(hashtagPromises)

        await transaction.commit()
        return true
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function updateReport(id, file) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const response = await storageService.uploadFromLocal(file.path)
        const newReport = {
            url: response[0].metadata.selfLink,
            name: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
        }
        const oldReport = await project.getReport()
        await project.createReport(newReport, { transaction })
        await storageService.deleteFile(oldReport.name)
        await oldReport.destroy({ transaction })

        await transaction.commit()
        return true
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function addAuthors(id, authors, files) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const authorCount = await project.countAuthors()
    if(authorCount + authors.length > 10) {
        throw { code: 'LIMIT_AUTHOR_COUNT' }
    }
    const emails = authors.map(a => a.email)
    const emailCount = await db.Author.count({
        where: { email: { [Op.or]: emails } },
    })
    if(emailCount) {
        throw { code: 'EMAIL_EXISTS' }
    }
    const filepaths = files.map(f => f.path)
    const responses = await storageService.uploadFilesFromLocal(filepaths)
    const newFiles = files.map((f, i) => ({
        url: responses[i][0].metadata.selfLink,
        name: f.filename,
        originalName: f.originalname,
        size: f.size,
        mimeType: f.mimetype,
    }))
    const newAuthors = authors.map(a => {
        const {fileIndex, ...values} = a
        values.projectId = id
        if(typeof fileIndex == 'number') {
            values.avatar = newFiles[fileIndex]
        }
        return values
    })
    const results = await db.Author.bulkCreate(newAuthors, {
        include: ['avatar'], 
    })
    console.log(results[0].dataValues)
    return results.map(r => {
        const { avatarId, createdAt, updatedAt, ...rest } = r.dataValues
        return rest
    })
}

async function addPhotos(id, files) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const filepaths = files.map(f => f.path)
    const responses = await storageService.uploadFilesFromLocal(filepaths)
    const newFiles = files.map((f, i) => ({
        url: responses[i][0].metadata.selfLink,
        name: f.filename,
        originalName: f.originalname,
        size: f.size,
        mimeType: f.mimetype,
        photo: { projectId: id },
    }))
    const results = await db.File.bulkCreate(newFiles, {
        include: ['photo'], 
    })
    return results.map(r => {
        const { photo, createdAt, ...rest } = r.dataValues
        return rest
    })
}

async function removePhoto(projectId, photoId) {
    const project = await db.Project.findByPk(projectId, {
        include: {
            model: db.Photo,
            where: { id: photoId }
        }
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const photo = project.photos[0]
        const file = await photo.getFile()
        await storageService.deleteFile(file.name)
        await photo.destroy({ transaction })
        await file.destroy({ transaction })

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

export { getProjects, addProject, updateProject, updateReport, addAuthors, addPhotos, removePhoto }
