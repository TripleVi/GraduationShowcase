import { Router } from 'express'

import * as ctrl from '../controllers/author-controller'
import * as upload from '../middlewares/file-upload'

const router = Router()

router.put('/:id', ctrl.editAuthor)
router.put('/:id/avatar', upload.uploadAvatar, ctrl.updateAvatar)
router.delete('/:id', ctrl.deleteAuthor)

export default router
