import { Router } from 'express'

import * as controller from '../controllers/project-controller'

const router = Router()

router.get('/', controller.fetchProjects)

export default router
