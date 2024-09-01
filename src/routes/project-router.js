import { Router } from 'express'

import * as controller from '../controllers/project-controller'
import { uploadProjectFiles } from '../middlewares/file-upload'

const router = Router()

router.get('/', controller.fetchProjects)
router.post('/', uploadProjectFiles, controller.createProject)

export default router
