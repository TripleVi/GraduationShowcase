import authRouter from './auth-router'
import majorRouter from './major-router'
import topicRouter from './topic-router'
import projectRouter from './project-router'
import authorRouter from './author-router'
import commentRouter from './comment-router'
import settingRouter from './setting-router'
import backupRouter from './backup-router'
import chatRouter from './chat-router'

function initRoutes(app) {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/majors', majorRouter)
    app.use('/api/v1/topics', topicRouter)
    app.use('/api/v1/projects', projectRouter)
    app.use('/api/v1/authors', authorRouter)
    app.use('/api/v1/comments', commentRouter)
    app.use('/api/v1/settings', settingRouter)
    app.use('/api/v1/backups', backupRouter)
    app.use('/api/v1/chats', chatRouter)
}

export default initRoutes
