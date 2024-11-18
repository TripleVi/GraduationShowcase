import { Op } from 'sequelize'

import db from '../models'

async function getOrphanComments(id, options) {
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = options
    const project = await db.Project.findByPk(id, {
        attributes: ['id'],
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const getPromises = [
        project.countComments({ where: { parentId: null } }),
        project.getComments({
            attributes: ['id', 'content', 'parentId', 'createdAt', 'updatedAt'],
            where: { parentId: null },
            include: {
                model: db.User,
                as: 'author',
                attributes: ['id', 'name', 'avatarUrl'],
                required: true,
            },
            order: [['createdAt', 'DESC']],
            offset,
            limit: Math.min(limit, upperLimit),
        })
    ]
    const [count, comments] = await Promise.all(getPromises)
    return {
        data: comments,
        metadata: {
            totalItems: count,
        },
    }
}

async function getDescendantComments(id, options) {
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = options
    const parent = await db.Comment.findByPk(id, {
        attributes: ['location'],
    })
    if(!parent) {
        throw { code: 'COMMENT_NOT_EXIST' }
    }
    const path = `${parent.location || ''}${id}/`
    const getPromises = [
        db.Comment.count({
            where: { location: { [Op.startsWith]: path } },
        }),
        db.Comment.findAll({
            attributes: ['id', 'content', 'parentId', 'createdAt', 'updatedAt'],
            where: { location: { [Op.startsWith]: path } },
            include: {
                model: db.User,
                as: 'author',
                attributes: ['id', 'name', 'avatarUrl'],
                required: true,
            },
            order: [['createdAt', 'ASC']],
            offset,
            limit: Math.min(limit, upperLimit),
        })
    ]
    const [count, comments] = await Promise.all(getPromises)
    return {
        data: comments,
        metadata: {
            totalItems: count,
        },
    }
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
                ? `${parent.location}${parentId}/`
                : `${parentId}/`
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

export { getOrphanComments, getDescendantComments, addComment, updateComment, removeComment }
