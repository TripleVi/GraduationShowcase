import * as authorService from '../services/author-service'
import * as errors from '../utils/errors'

const editAuthorGroup = async (req, res) => {
    const id = req.params.id
    const authors = req.body
    try {
        console.log(authors)
        // await authorService.updateAuthorGroup(id, authors)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'PROJECT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'AUTHOR_NOT_EXIST':
                res.status(409).send(errors.AUTHOR_NOT_EXIST)
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

export { editAuthorGroup, updateAvatar, deleteAuthor }
