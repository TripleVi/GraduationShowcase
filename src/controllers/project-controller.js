import * as projectService from '../services/project-service'
import * as errors from '../utils/errors'

const fetchProjects = async (req, res) => {
    const options = req.query
    try {
        const projects = await projectService.getProjects(options)
        res.status(200).send(projects)
    } catch (error) {
        switch (error.code) {
            case 'TOPIC_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'MAJOR_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const fetchProjectDetail = async (req, res) => {
    try {
        const id = req.params.id
        const projects = await projectService.getProjectDetail(id)
        res.status(200).send(projects)
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

const createProject = async (req, res) => {
    const project = req.body
    const files = req.files
    try {
        const result = await projectService.addProject(project, files)
        res.status(201).send(result)
    } catch (error) {
        console.log(error)
        switch (error.code) {
            case 'TOPIC_NOT_EXIST':
                res.status(409).send(errors.TOPIC_NOT_EXIST)
                break
            case 'EMAIL_EXISTS':
                res.status(400).send(errors.EMAIL_EXISTS)
                break
            default:
                res.sendStatus(500)
        }
    }
}

const editProject = async (req, res) => {
    const id = req.params.id
    const project = req.body
    try {
        await projectService.updateProject(id, project)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'PROJECT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'TOPIC_NOT_EXIST':
                res.status(409).send(errors.TOPIC_NOT_EXIST)
                break
            case 'PHOTO_NOT_EXIST':
                res.status(409).send(errors.PHOTO_NOT_EXIST)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const editReport = async (req, res) => {
    const id = req.params.id
    const file = req.file
    try {
        await projectService.updateReport(id, file)
        res.sendStatus(204)
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

const createAuthors = async (req, res) => {
    const id = req.params.id
    const authors = req.body
    const avatars = req.files
    try {
        const created = await projectService.addAuthors(id, authors, avatars)
        res.status(201).send(created)
    } catch (error) {
        switch (error.code) {
            case 'TOPIC_NOT_EXIST':
                res.status(409).send(errors.TOPIC_NOT_EXIST)
                break
            case 'EMAIL_EXISTS':
                res.status(400).send(errors.EMAIL_EXISTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const createPhotos = async (req, res) => {
    const id = req.params.id
    const photos = req.files
    try {
        const results = await projectService.addPhotos(id, photos)
        res.status(201).send(results)
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

const deletePhoto = async (req, res) => {
    const projectId = req.params.id
    const photoId = req.params.pid
    try {
        await projectService.removePhoto(projectId, photoId)
        res.sendStatus(204)
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

const deleteProject = async (req, res) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    try {
        await projectService.removeProject(id)
        res.sendStatus(204)
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

const createReaction = async (req, res) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    try {
        await projectService.addReaction(id)
        res.sendStatus(204)
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

const deleteReaction = async (req, res) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    try {
        await projectService.removeReaction(id)
        res.sendStatus(204)
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

export { fetchProjects, fetchProjectDetail, createProject, editProject, editReport, createAuthors, createPhotos, deletePhoto, deleteProject, createReaction, deleteReaction }
