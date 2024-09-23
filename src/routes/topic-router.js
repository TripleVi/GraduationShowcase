import { Router } from 'express'

import * as topicCtrl from '../controllers/topic-controller'
import * as topicVal from '../middlewares/validators/topic-validator'
import { verifyJWT, isAdmin } from '../middlewares/auth'

const router = Router()

router.get('/', topicVal.checkGet, topicCtrl.fetchTopics)
router.put('/:id', verifyJWT, isAdmin, topicVal.checkPut, topicCtrl.editTopic)
router.delete('/:id', verifyJWT, isAdmin, topicVal.checkDelete, topicCtrl.deleteTopic)

export default router
