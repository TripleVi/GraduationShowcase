import { Router } from 'express'

import { verifyJWT, isAdmin } from '../middlewares/auth'
import * as ctrl from '../controllers/backup-controller'
import * as val from '../middlewares/validators/backup-validator'

const router = Router()

router.get('/database', verifyJWT, isAdmin, val.checkGet, ctrl.fetchDBBackups)
router.delete('/:id', verifyJWT, isAdmin, val.checkDelete, ctrl.deleteBackup)
router.post('/:id/restore', verifyJWT, isAdmin, ctrl.restoreBackup)
router.get('/:id', verifyJWT, isAdmin, ctrl.fetchBackupFile)

export default router
