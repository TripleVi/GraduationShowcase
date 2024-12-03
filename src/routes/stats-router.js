import { Router } from 'express'

import * as statsCtrl from '../controllers/stats-controller'
import { verifyJWT, isAdmin } from '../middlewares/auth'

const router = Router()

router.get('/', verifyJWT, isAdmin, statsCtrl.fetchStats)

export default router
