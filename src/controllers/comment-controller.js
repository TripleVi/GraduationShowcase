import * as commentService from '../services/comment-service'
import * as errors from '../utils/errors'

const fetchOrphanComments = async (req, res) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    try {
        const results = await commentService.getOrphanComments(id)
        res.status(200).send(results)
    } catch (error) {
        switch (error.code) {
            case 'PROJECT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'BAD_REQUEST':
                res.sendStatus(400)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const createComment = async (req, res) => {
    const id = req.params.id
    const comment = req.body
    comment.authorId = req.User.uid
    if(!id) {
        return res.sendStatus(404)
    }
    try {
        const result = await commentService.addComment(id, comment)
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
        authorId: req.User.uid,
        ...req.body,
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

export { fetchOrphanComments, createComment, editComment, deleteComment }
