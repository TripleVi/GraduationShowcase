import authRouter from './auth-router'
import majorRouter from './major-router'

function initRoutes(app) {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/majors', majorRouter)
}

export default initRoutes
