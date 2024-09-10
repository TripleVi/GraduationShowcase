import * as authorService from '../services/author-service'
import * as errors from '../utils/errors'

const editAuthor = async (req, res) => {
    const id = req.params.id
    const author = req.body
    try {
        await authorService.updateAuthor(id, author)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'AUTHOR_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'EMAIL_EXISTS':
                res.status(409).send(errors.EMAIL_EXISTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const updateAvatar = async (req, res) => {
    const id = req.params.id
    const avatar = req.file
    try {
        await authorService.updateAvatar(id, avatar)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'AUTHOR_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const deleteAuthor = async (req, res) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    try {
        await authorService.deleteAuthor(id)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'AUTHOR_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { editAuthor, updateAvatar, deleteAuthor }
