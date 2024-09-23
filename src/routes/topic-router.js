import { Router } from 'express'

import * as topicCtrl from '../controllers/topic-controller'
import * as topicVal from '../middlewares/validators/topic-validator'
import { verifyJWT } from '../middlewares/auth'

const router = Router()

router.get('/', topicVal.checkGet, topicCtrl.fetchTopics)
router.put('/:id', verifyJWT, topicVal.checkPut, topicCtrl.editTopic)
router.delete('/:id', verifyJWT, topicCtrl.deleteTopic)

export default router
