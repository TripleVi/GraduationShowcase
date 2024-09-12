import { Router } from 'express'

import * as ctrl from '../controllers/project-controller'
import * as upload from '../middlewares/file-upload'
import * as val from '../middlewares/validators/project-validator'

const router = Router()

router.get('/', ctrl.fetchProjects)
router.get('/:id', ctrl.fetchProjectDetails)
router.post('/', upload.uploadProjectFiles, val.checkPostProject, ctrl.createProject)
router.put('/:id', val.checkPutProject, ctrl.editProject)
router.put('/:id/report', upload.uploadReport, ctrl.editReport)
router.post('/:id/author-group', upload.uploadAvatars, ctrl.createAuthors)
router.post('/:id/photos', upload.uploadPhotos, ctrl.createPhotos)
router.delete('/:id/photos/:pid', ctrl.deletePhoto)
router.post('/:id/reaction', ctrl.createReaction)
router.delete('/:id/reaction', ctrl.deleteReaction)
router.get('/:id/comments', ctrl.fetchOrphanComments)
router.post('/:id/comments', ctrl.createComment)

// router.put('/authors', controller.updateAuthors)

export default router
