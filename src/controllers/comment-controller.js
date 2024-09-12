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
    const id = req.params.id.trim()
    const comment = req.body
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
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { fetchOrphanComments, createComment }
