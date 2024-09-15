import { Router } from 'express'

import * as controller from '../controllers/major-controller'
import { verifyJWT } from '../middlewares/auth'
import * as validator from '../middlewares/validators/major-validator'

const router = Router()

router.get('/', controller.fetchMajors)
router.post('/', verifyJWT, validator.checkPostMajor, controller.createMajor)
router.put('/:id', verifyJWT, validator.checkPutMajor, controller.editMajor)
router.delete('/:id', verifyJWT, controller.deleteMajor)

export default router
