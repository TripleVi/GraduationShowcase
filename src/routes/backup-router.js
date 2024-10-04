import { Router } from 'express'

import * as ctrl from '../controllers/backup-controller'
import * as val from '../middlewares/validators/backup-validator'

const router = Router()

router.get('/database', val.checkGet, ctrl.fetchDBBackups)
router.delete('/:id', val.checkDelete, ctrl.deleteBackup)

export default router
