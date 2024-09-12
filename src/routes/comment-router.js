import { Router } from 'express'

import { verifyJWT } from '../middlewares/auth'
import * as ctrl from '../controllers/comment-controller'
import * as val from '../middlewares/validators/comment-validator'

const router = Router()

router.put('/:id', verifyJWT, val.checkPutComment, ctrl.editComment)
router.delete('/:id', verifyJWT, ctrl.deleteComment)

export default router
