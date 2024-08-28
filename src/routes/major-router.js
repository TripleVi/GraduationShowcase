import { Router } from 'express'

import * as majorController from '../controllers/major-controller'
import { verifyJWT } from '../middlewares/auth'

const router = Router()

router.get('/', verifyJWT, majorController.fetchMajors)
router.post('/', verifyJWT, majorController.createMajor)

export default router
