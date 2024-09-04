import { Op } from 'sequelize'
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
        // const created = await db.Project.create(values, { transaction })
        const result = await db.Hashtag.findAll({
            where: { name: { [Op.or]: hashtags } },
            raw: true,
        })
        const names = result.map(h => h.name)
        const hashtagPromises = []
        for (const name of hashtags) {
            if(!names.includes(h)) {
                hashtagPromises.push(
                    db.Hashtag.create({ name }, { transaction })
                )
            }
        }
        const temp = await Promise.all(hashtagPromises)
        console.log(result)
        
        // console.log(created)
        await transaction.commit()
    } catch (error) {
        console.log('hello world')
        await transaction.rollback()
        throw error
    }
}

export { getProjects, addProject }
