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
    const projects = await db.Project.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            {
                model: db.Photo,
                attributes: ['id'],
                include: [
                    {
                        model: db.File,
                        required: true,
                    }
                ]
            },
        ],
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

async function addPhotos(projectId, files) {
    const bucket = getStorage().bucket()
    const createdIds = []
    for (const f of files) {
        const response = await bucket.upload(f.path)
        const metadata = response['0'].metadata
        const file = {
            url: metadata.selfLink,
            name: metadata.name,
            originalName: metadata.name,
            size: metadata.size,
            mimeType: metadata.contentType
        }
        const created = await db.File.create(file)
        createdIds.push(created.dataValues.id)
    }
    const photoPromises = []
    for (const fileId of createdIds) {
        const photo = { projectId, fileId }
        photoPromises.push(
            db.Photo.create(photo)
        )
    }
    const photos = await Promise.all(photoPromises)
    return photos
}

export { getProjects, addProject, updateProject, addPhotos }
