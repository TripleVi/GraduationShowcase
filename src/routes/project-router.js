import { Router } from 'express'

import { verifyJWT } from '../middlewares/auth'
import * as projectCtrl from '../controllers/project-controller'
import * as commentCtrl from '../controllers/comment-controller'
import * as upload from '../middlewares/file-upload'
import * as projectVal from '../middlewares/validators/project-validator'
import * as commentVal from '../middlewares/validators/comment-validator'

const router = Router()

router.get('/', projectCtrl.fetchProjects)
router.get('/:id', projectCtrl.fetchProjectDetails)
router.post('/', upload.uploadProjectFiles, projectVal.checkPostProject, projectCtrl.createProject)
router.put('/:id', projectVal.checkPutProject, projectCtrl.editProject)
router.put('/:id/report', upload.uploadReport, projectCtrl.editReport)
router.post('/:id/author-group', upload.uploadAvatars, projectCtrl.createAuthors)
router.post('/:id/photos', upload.uploadPhotos, projectCtrl.createPhotos)
router.delete('/:id/photos/:pid', projectCtrl.deletePhoto)
router.post('/:id/reaction', projectCtrl.createReaction)
router.delete('/:id/reaction', projectCtrl.deleteReaction)
router.get('/:id/comments', commentCtrl.fetchOrphanComments)
router.post('/:id/comments', verifyJWT, commentVal.checkPostComment, commentCtrl.createComment)

export default router
