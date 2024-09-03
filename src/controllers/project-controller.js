import * as projectService from '../services/project_service'

const fetchProjects = async (req, res) => {
    const projects = await projectService.getProjects()
    res.status(200).send(projects)
}

const createProject = async (req, res) => {
    console.log(req.file)
    // try {
    //     await projectService.addProject(req.body)
    // } catch (error) {
    //     console.log(error.code)
    // }
    res.status(201).send('hello world')
}

export { fetchProjects, createProject }
