import { Router } from 'express'

import * as ctrl from '../controllers/setting-controller'
import { verifyJWT, isAdmin } from '../middlewares/auth'
import * as val from '../middlewares/validators/setting-validator'

const router = Router()

router.put('/backups/database', val.checkPutDBBackup, ctrl.editDBBackup)

export default router
