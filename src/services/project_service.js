import db from '../models'

async function getProjects() {
    const projects = await db.Project.findAll({
        attributes: { exclude: ['topicId', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: db.Author,
                attributes: { exclude: ['createdAt', 'updatedAt', 'projectId'] },
            },
            {
                model: db.Hashtag,
                through: { attributes: [] },
            },
            {
                model: db.Photo,
                attributes: { exclude: ['projectId'] },
            },
            {
                model: db.Report,
                attributes: { exclude: ['projectId'] },
            },
        ],
    })
    return projects.map(p => {
        const values = p.dataValues
        values.hashtags = values.hashtags.map(h => h.name)
        return values
    })
}

async function addProject() {

}

export { getProjects, addProject }
