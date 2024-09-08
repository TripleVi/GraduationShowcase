import { Router } from 'express'

import * as ctrl from '../controllers/project-controller'
import { uploadProjectPhotos, uploadProjectFiles } from '../middlewares/file-upload'
import * as val from '../middlewares/validators/project-validator'

const router = Router()

router.get('/', ctrl.fetchProjects)
router.post('/', uploadProjectFiles, val.checkPostProject, ctrl.createProject)
router.put('/:id', ctrl.updateProject)
router.delete('/:id', ctrl.deleteProject)
router.post('/:id/photos', uploadProjectPhotos, ctrl.createPhotos)
router.delete('/:id/photos', uploadProjectPhotos, ctrl.deletePhotos)

// router.put('/authors', controller.updateAuthors)

export default router
