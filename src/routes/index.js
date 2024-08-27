import authRouter from './auth-router.js'

function initRoutes(app) {
    app.use('/api/v1/auth', authRouter)
}

export default initRoutes
