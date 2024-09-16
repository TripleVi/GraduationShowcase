import { Router } from 'express'

import * as ctrl from '../controllers/major-controller'
import { verifyJWT } from '../middlewares/auth'
import * as val from '../middlewares/validators/major-validator'

const router = Router()

router.get('/', val.checkGet, ctrl.fetchMajors)
router.post('/', verifyJWT, val.checkPost, ctrl.createMajor)
router.put('/:id', verifyJWT, val.checkPut, ctrl.editMajor)
router.delete('/:id', verifyJWT, ctrl.deleteMajor)

export default router
