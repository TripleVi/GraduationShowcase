import { Router } from 'express'

import { uploadFiles } from '../middlewares/file-upload'
import * as fileController from '../controllers/file-controller'

const router = Router()

router.post('/', uploadFiles, fileController.createFiles)
router.delete('/', fileController.deleteFiles)

export default router
