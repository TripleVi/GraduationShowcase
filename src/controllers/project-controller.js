import * as projectService from '../services/project-service'
import * as errors from '../utils/errors'

const fetchProjects = async (req, res) => {
    const projects = await projectService.getProjects()
    res.status(200).send(projects)
}

const createProject = async (req, res) => {
    const project = req.body
    const files = req.files
    try {
        const created = await projectService.addProject(project, files)
        res.status(201).send(created)
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

const updateProject = async (req, res) => {
    res.sendStatus(200)
}

const deleteProject = async (req, res) => {
    res.sendStatus(200)
}

const createPhotos = async (req, res) => {
    const id = req.params.id
    const photos = req.files
    try {
        const created = await projectService.addPhotos(id, photos)
        res.status(201).send(created)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const deletePhotos = async (req, res) => {
    res.sendStatus(200)
}

export { fetchProjects, createProject, updateProject, deleteProject, createPhotos, deletePhotos }
