import { Router } from 'express'

import { verifyJWT, isAdmin } from '../middlewares/auth'
import * as projectCtrl from '../controllers/project-controller'
import * as commentCtrl from '../controllers/comment-controller'
import * as upload from '../middlewares/file-upload'
import * as projectVal from '../middlewares/validators/project-validator'
import * as commentVal from '../middlewares/validators/comment-validator'

const router = Router()

router.get('/', projectVal.checkGet, projectCtrl.fetchProjects)
router.get('/:id', projectVal.checkGetDetail, projectCtrl.fetchProjectDetail)
router.post('/', verifyJWT, isAdmin, upload.uploadProjectFiles, projectVal.checkPost, projectCtrl.createProject)
router.put('/:id', verifyJWT, isAdmin, projectVal.checkPut, projectCtrl.editProject)
router.delete('/:id', verifyJWT, isAdmin, projectCtrl.deleteProject)
router.put('/:id/report', verifyJWT, isAdmin, upload.uploadReport, projectCtrl.editReport)
router.post('/:id/author-group', verifyJWT, isAdmin, upload.uploadAvatars, projectCtrl.createAuthors)
router.post('/:id/photos', upload.uploadPhotos, projectCtrl.createPhotos)
router.delete('/:id/photos/:pid', projectCtrl.deletePhoto)
router.post('/:id/reaction', projectCtrl.createReaction)
router.delete('/:id/reaction', projectCtrl.deleteReaction)
router.get('/:id/comments', commentCtrl.fetchOrphanComments)
router.post('/:id/comments', verifyJWT, commentVal.checkPostComment, commentCtrl.createComment)

export default router
