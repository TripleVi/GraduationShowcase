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
    const projectCount = await db.Project.count({ where: { id } })
    if(!projectCount) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    if(comment.parentId) {
        const parent = await db.Comment.findOne({
            attributes: ['level'],
            where: { id: comment.parentId, projectId: id }
        })
        console.log(parent)
        if(!parent) {
            throw { code: 'COMMENT_NOT_EXIST' }
        }
        comment.level = parent.level + 1
    }
    comment.projectId = id
    return db.Comment.create(comment)
}

export { getOrphanComments, addComment }
