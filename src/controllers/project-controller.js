import * as projectService from '../services/project_service'

const fetchProjects = async (req, res) => {
    const projects = await projectService.getProjects()
    res.status(200).send(projects)
}

export { fetchProjects }
