import authRouter from './auth-router'
import majorRouter from './major-router'
import topicRouter from './topic-router'
import projectRouter from './project-router'

function initRoutes(app) {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/majors', majorRouter)
    app.use('/api/v1/topics', topicRouter)
    app.use('/api/v1/projects', projectRouter)
}

export default initRoutes
