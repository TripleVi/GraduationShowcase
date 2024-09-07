import { Router } from 'express'

import * as controller from '../controllers/project-controller'
import { uploadProjectPhotos } from '../middlewares/file-upload'
import * as validator from '../middlewares/validators/project-validator'

const router = Router()

router.get('/', controller.fetchProjects)
router.post('/', controller.createProject)
router.put('/:id', controller.updateProject)
router.delete('/:id', controller.deleteProject)
router.post('/:id/photos', uploadProjectPhotos, controller.createPhotos)
router.delete('/:id/photos', uploadProjectPhotos, controller.deletePhotos)

// router.put('/authors', controller.updateAuthors)

export default router
