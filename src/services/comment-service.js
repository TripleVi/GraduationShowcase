import db from '../models'

async function getOrphanComments(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const comments = await project.getComments()
    return comments
}

async function addComment(id, comment) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const values = { likes: project.likes + 1 }
    await project.update(values)
}

export { getOrphanComments, addComment }
