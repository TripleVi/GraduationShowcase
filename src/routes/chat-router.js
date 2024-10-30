import { Router } from 'express'

import { verifyJWT } from '../middlewares/auth'
import * as ctrl from '../controllers/chat-controller'

const router = Router()

router.get('/', verifyJWT, ctrl.fetchChats)
router.get('/:id/messages', verifyJWT, ctrl.fetchMessages)
router.post('/', verifyJWT, ctrl.createChat)
router.post('/:id/messages', verifyJWT, ctrl.createMessage)
router.delete('/:id', verifyJWT, ctrl.deleteChat)

export default router
