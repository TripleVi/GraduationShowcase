import { Op } from 'sequelize'

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

async function getProjectById(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const views = project.views + 1
    db.Project.update({ views }, { where: { id }})

    return project
}

async function addProject(project, files) {
    const { hashtags, authors, ...newProject } = project
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

    const { report, photos, avatars } = files
    const allFiles = []
    if(report) allFiles.push(...report)
    if(photos) allFiles.push(...photos)
    if(avatars) allFiles.push(...avatars)
    const transaction = await db.sequelize.transaction()
    try {
        const createPromises = []
        const project = await db.Project.create(newProject, { transaction })
        const existingHashtags = await db.Hashtag.findAll({
            where: { name: { [Op.or]: hashtags } },
        })
        const names = existingHashtags.map(h => h.name)
        const newHashtags = hashtags
                .filter(n => !names.includes(n))
                .map(name => ({ name }))
        const createdHashtags = await db.Hashtag
                .bulkCreate(newHashtags, { transaction })
        createPromises.push(
            project.addHashtags([...existingHashtags, ...createdHashtags], { 
                transaction, 
            })
        )
        allFiles.forEach(f => f.ref = `projects/${project.id}/${f.filename}`)
        const responses = await storageService.uploadFilesFromLocal(allFiles)
        const newFiles = allFiles.map((f, i) => ({
            url: responses[i][0].metadata.selfLink,
            name: f.filename,
            originalName: f.originalname,
            size: f.size,
            mimeType: f.mimetype,
        }))
        let index = 0
        if(report) {
            createPromises.push(
                project.createReport(newFiles[index++], { transaction })
            )
        }
        const newAuthors = authors.map(a => {
            const { fileIndex, ...values } = a
            values.projectId = project.id
            if(typeof fileIndex == 'number') {
                values.avatar = newFiles[fileIndex+index]
            }
            return values
        })
        createPromises.push(
            db.Author.bulkCreate(newAuthors, {
                include: ['avatar'],
                transaction,
            })
        )
        index += avatars ? avatars.length : 0
        if(photos) {
            const newPhotos = []
            while (index < newFiles.length) {
                newPhotos.push({
                    projectId: project.id,
                    file: newFiles[index++],
                })
            }
            createPromises.push(
                db.Photo.bulkCreate(newPhotos, {
                    include: ['file'],
                    transaction,
                })
            )
        }
        await Promise.all(createPromises)
        
        await transaction.commit()
        return project
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

async function removeProject(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const fileIds = []
        const deletePromises = []
        const deletePromises2 = []
        // delete upstream folder
        deletePromises2.push(storageService.deleteFolder(`project/${id}`))
        // delete project_hashtags
        deletePromises.push(project.setHashtags([], { transaction }))
        // delete authors
        const authors = await project.getAuthors({
            attributes: ['avatarId'],
            where: { avatarId: { [Op.ne]: null } },
            raw: true,
        })
        fileIds.push(authors.map(a => a.avatarId))
        deletePromises.push(
            db.Author.destroy({
                where: { projectId: id },
                transaction,
            })
        )
        // delete photos
        const photos = await project.getPhotos({
            attributes: ['fileId'],
            raw: true,
        })
        fileIds.push(photos.map(p => p.fileId))
        deletePromises.push(
            db.Photo.destroy({
                where: { projectId: id },
                transaction,
            })
        )
        await Promise.all(deletePromises)
        //delete project
        deletePromises2.push(project.destroy({ transaction }))
        // delete files
        deletePromises2.push(
            db.File.destroy({
                where: { id: { [Op.or]: fileIds } },
                transaction,
            })
        )
        await Promise.all(deletePromises2)
        // delete comment

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function addReaction(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const values = { likes: project.likes + 1 }
    await project.update(values)
}

async function removeReaction(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    if(!project.likes) {
        throw { code: 'BAD_REQUEST' }
    }
    const values = { likes: project.likes - 1 }
    await project.update(values)
}

async function getOrphanComments(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const comments = await project.getComments()
    return comments
}

export { getProjects, getProjectById, addProject, updateProject, updateReport, addAuthors, addPhotos, removePhoto, removeProject, addReaction, removeReaction, getOrphanComments }
