import db from '../models'

async function getProjects() {
    const projects = await db.Author.findAll({
        // attributes: { exclude: ['createdAt', 'updatedAt'] },
        // include: [
        //     {
        //         model: db.Author,
        //         // attributes: { exclude: ['projectId'] },
        //     },
        //     // {
        //     //     model: db.Author,
        //     //     attributes: { exclude: ['createdAt', 'updatedAt', 'projectId'] },
        //     // },
        //     // {
        //     //     model: db.Hashtag,
        //     //     through: { attributes: [] },
        //     //     attributes: { exclude: ['createdAt', 'updatedAt', 'projectId'] },
        //     // },
        // ],
    })
    console.log(projects)
    return projects
}

export { getProjects }
