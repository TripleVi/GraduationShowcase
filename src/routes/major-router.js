import { Router } from 'express'

import * as ctrl from '../controllers/major-controller'
import * as topicCtrl from '../controllers/topic-controller'
import { verifyJWT, isAdmin } from '../middlewares/auth'
import * as val from '../middlewares/validators/major-validator'
import * as topicVal from '../middlewares/validators/topic-validator'

const router = Router()

router.get('/', val.checkGet, ctrl.fetchMajors)
router.post('/', verifyJWT, isAdmin, val.checkPost, ctrl.createMajor)
router.put('/:id', verifyJWT, isAdmin, val.checkPut, ctrl.editMajor)
router.delete('/:id', verifyJWT, isAdmin, ctrl.deleteMajor)
router.get('/:id/topics', topicVal.checkGet, topicCtrl.fetchTopicsByMajor)
router.post('/:id/topics', verifyJWT, topicVal.checkPost, topicCtrl.createTopic)

export default router
