import { Op } from 'sequelize'
import { getStorage } from 'firebase-admin/storage'

import db from '../models'

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

async function addProject(project) {
    const { hashtags, authors, ...values } = project
    const topic = await db.Topic.findByPk(values.topicId)
    if(!topic) {
        throw { code: 'MAJOR_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const created = await db.Project.create(values, { transaction })
        // const result = await db.Hashtag.findAll({
        //     where: { name: { [Op.or]: hashtags } },
        //     raw: true,
        // })
        // const names = result.map(h => h.name)
        // const hashtagPromises = []
        // for (const name of hashtags) {
        //     if(!names.includes(h)) {
        //         hashtagPromises.push(
        //             db.Hashtag.create({ name }, { transaction })
        //         )
        //     }
        // }
        const authorPromises = []
        for (const author of authors) {
            author.projectId = created.dataValues.id
            authorPromises.push(
                db.Author.create(author, { transaction })
            )
        }
        // await Promise.all(hashtagPromises)
        await Promise.all(authorPromises)
        
        await transaction.commit()
        console.log(created)
        return created
    } catch (error) {
        console.log('hello world')
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

export { getProjects, addProject, addPhotos }
