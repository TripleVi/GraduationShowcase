import { Router } from 'express'

import { verifyJWT, isAdmin } from '../middlewares/auth'
import * as projectCtrl from '../controllers/project-controller'
import * as commentCtrl from '../controllers/comment-controller'
import * as authorCtrl from '../controllers/author-controller'
import * as upload from '../middlewares/file-upload'
import * as projectVal from '../middlewares/validators/project-validator'
import * as commentVal from '../middlewares/validators/comment-validator'
import * as authorVal from '../middlewares/validators/author-validator'

const router = Router()

router.get('/', projectVal.checkGet, projectCtrl.fetchProjects)
router.get('/:id', projectVal.checkGetDetail, projectCtrl.fetchProjectDetail)
router.post('/', verifyJWT, isAdmin, upload.uploadProjectFiles, projectVal.checkPost, projectCtrl.createProject)
router.post('/:id', verifyJWT, isAdmin, upload.uploadProjectFiles2, projectVal.checkPost2, projectCtrl.createProjectFiles)
router.put('/:id', verifyJWT, isAdmin, projectVal.checkPut, projectCtrl.editProject)
router.delete('/:id', verifyJWT, isAdmin, projectCtrl.deleteProject)
// router.put('/:id/report', verifyJWT, isAdmin, upload.uploadReport, projectCtrl.editReport)
router.post('/:id/author-group', verifyJWT, isAdmin, upload.uploadAvatars, projectCtrl.createAuthors)
router.put('/:id/author-group', verifyJWT, isAdmin, authorVal.checkPut, authorCtrl.editAuthorGroup)
// router.post('/:id/photos', verifyJWT, isAdmin, upload.uploadPhotos, projectCtrl.createPhotos)
// router.delete('/:id/photos/:pid', verifyJWT, isAdmin, projectCtrl.deletePhoto)
router.post('/:id/reaction', verifyJWT, projectCtrl.createReaction)
router.delete('/:id/reaction', verifyJWT, projectCtrl.deleteReaction)
router.get('/:id/comments', commentVal.checkGet, commentCtrl.fetchOrphanComments)
router.post('/:id/comments', verifyJWT, commentVal.checkPostComment, commentCtrl.createComment)

export default router
