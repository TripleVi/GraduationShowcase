import * as projectService from '../services/project_service'

const fetchProjects = async (req, res) => {
    const projects = await projectService.getProjects()
    res.status(200).send(projects)
}

const createProject = async (req, res) => {
    try {
        // const created = await projectService.addProject(req.body)
        // res.status(201).send(created)
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        }
        let i = 0
        res.set(headers)
        res.status(200)
        const intervalId = setInterval(() => {
            res.write(JSON.stringify({status: i++}))
        }, 1000)
        setTimeout(() => {
            clearInterval(intervalId);
            res.end()
        }, 10000)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
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
