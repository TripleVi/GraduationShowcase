import { Router } from 'express'

import * as ctrl from '../controllers/project-controller'
import * as upload from '../middlewares/file-upload'
import * as val from '../middlewares/validators/project-validator'

const router = Router()

router.get('/', ctrl.fetchProjects)
router.post('/', upload.uploadProjectFiles, val.checkPostProject, ctrl.createProject)
router.put('/:id', val.checkPutProject, ctrl.editProject)
router.put('/:id/report', upload.uploadReport, ctrl.editReport)
router.delete('/:id', ctrl.deleteProject)
router.post('/:id/photos', upload.uploadProjectPhotos, ctrl.createPhotos)
router.delete('/:id/photos', upload.uploadProjectPhotos, ctrl.deletePhotos)

// router.put('/authors', controller.updateAuthors)

export default router
