import db from '../models'

async function getProjects() {
    const projects = db.Project.findAll()
}

export { getProjects }
