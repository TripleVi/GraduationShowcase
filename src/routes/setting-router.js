import { Router } from 'express'

import * as ctrl from '../controllers/setting-controller'
import { verifyJWT, isAdmin } from '../middlewares/auth'

const router = Router()

router.put('/backups/database', verifyJWT, isAdmin, ctrl.editDBBackup)

export default router
