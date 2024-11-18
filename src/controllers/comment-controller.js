import * as commentService from '../services/comment-service'
import * as errors from '../utils/errors'

const fetchOrphanComments = async (req, res) => {
    const id = req.params.id
    const options = req.query
    try {
        const comments = await commentService.getOrphanComments(id, options)
        res.status(200).send(comments)
    } catch (error) {
        switch (error.code) {
            case 'PROJECT_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const fetchDescendantComments = async (req, res) => {
    const id = req.params.id
    const options = req.query
    try {
        const comments = await commentService.getDescendantComments(id, options)
        res.status(200).send(comments)
    } catch (error) {
        switch (error.code) {
            case 'COMMENT_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const createComment = async (req, res) => {
    const comment = {
        ...req.body,
        authorId: req.User.uid,
        projectId: Number(req.params.id),
    }
    try {
        const result = await commentService.addComment(comment)
        res.status(201).send(result)
    } catch (error) {
        switch (error.code) {
            case 'PROJECT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'COMMENT_NOT_EXIST':
                res.status(400).send(errors.COMMENT_NOT_EXIST)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const editComment = async (req, res) => {
    const comment = {
        id: req.params.id,
        ...req.body,
        authorId: req.User.uid,
    }
    try {
        await commentService.updateComment(comment)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'COMMENT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'ACTION_FORBIDDEN':
                res.status(403).send(errors.COMMENT_PUT_FORBIDDEN)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const deleteComment = async (req, res) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    const authorId = req.User.uid
    try {
        await commentService.removeComment(id, authorId)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'COMMENT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'ACTION_FORBIDDEN':
                res.status(403).send(errors.COMMENT_DEL_FORBIDDEN)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { fetchOrphanComments, fetchDescendantComments, createComment, editComment, deleteComment }
