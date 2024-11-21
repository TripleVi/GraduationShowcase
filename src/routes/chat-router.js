import { Router } from 'express'

import { verifyJWT } from '../middlewares/auth'
import * as ctrl from '../controllers/chat-controller'
import * as val from '../middlewares/validators/chat-validator'

const router = Router()

router.get('/', verifyJWT, ctrl.fetchChats)
router.get('/:id/messages', verifyJWT, ctrl.fetchMessages)
router.post('/', verifyJWT, val.checkPost, ctrl.createChat)
router.post('/:id/messages', verifyJWT, val.checkPost, ctrl.createMessage)
router.delete('/:id', verifyJWT, ctrl.deleteChat)

export default router
