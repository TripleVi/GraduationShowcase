import db from '../models'

async function getOrphanComments(id) {
    const project = await db.Project.findByPk(id, {
        attributes: ['id'],
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const comments = await project.getComments({
        where: { parentId: null },
    })
    return comments
}

async function addComment(comment) {
    const { projectId, parentId } = comment
    const project = await db.Project.findByPk(projectId, {
        attributes: ['id'],
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    if(parentId) {
        const parent = await db.Comment.findOne({
            attributes: ['location'],
            where: { id: parentId, projectId },
        })
        if(!parent) {
            throw { code: 'COMMENT_NOT_EXIST' }
        }
        comment.location = parent.location
                ? `${parent.location}/${parentId}`
                : `${parentId}`
    }
    return project.createComment(comment)
}

async function updateComment(comment) {
    const { id, authorId, content } = comment
    const currentComment = await db.Comment.findByPk(id)
    if(!currentComment) {
        throw { code: 'COMMENT_NOT_EXIST' }
    }
    if(authorId !== currentComment.authorId) {
        throw { code: 'ACTION_FORBIDDEN' }
    }
    await currentComment.update({ content })
}

async function removeComment(id, authorId) {
    const comment = await db.Comment.findByPk(id)
    if(!comment) {
        throw { code: 'COMMENT_NOT_EXIST' }
    }
    if(comment.authorId !== authorId) {
        throw { code: 'ACTION_FORBIDDEN' }
    }
    await comment.destroy()
}

export { getOrphanComments, addComment, updateComment, removeComment }
