import { Router } from 'express'

import * as controller from '../controllers/topic-controller'
import * as validator from '../middlewares/validators/topic-validator'
import { verifyJWT } from '../middlewares/auth'

const router = Router()

router.get('/', controller.fetchTopics)
router.post('/', verifyJWT, validator.checkPostTopic, controller.createTopic)
router.put('/:id', verifyJWT, validator.checkPutTopic, controller.editTopic)
router.delete('/:id', verifyJWT, controller.deleteTopic)

export default router
