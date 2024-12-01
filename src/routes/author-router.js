import { Router } from 'express'

import { verifyJWT, isAdmin } from '../middlewares/auth'
import * as ctrl from '../controllers/author-controller'
import * as upload from '../middlewares/file-upload'

const router = Router()

router.put('/:id/avatar', verifyJWT, isAdmin, upload.uploadAvatar, ctrl.updateAvatar)
router.delete('/:id', verifyJWT, isAdmin, ctrl.deleteAuthor)

export default router
