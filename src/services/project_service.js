import db from '../models'

async function getProjects() {
    const projects = await db.Project.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            {
                model: db.Author,
                attributes: { exclude: ['projectId'] },
            },
            {
                model: db.Author,
                attributes: { exclude: ['createdAt', 'updatedAt', 'projectId'] },
            },
            {
                model: db.Hashtag,
                through: { attributes: [] },
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

export { getProjects }
