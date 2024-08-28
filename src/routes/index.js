import authRouter from './auth-router'
import majorRouter from './major-router'
import topicRouter from './topic-router'

function initRoutes(app) {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/majors', majorRouter)
    app.use('/api/v1/topics', topicRouter)
}

export default initRoutes
