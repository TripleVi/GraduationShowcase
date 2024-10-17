import { Router } from 'express'

import * as ctrl from '../controllers/auth-controller'
import * as val from '../middlewares/validators/auth-validator'
import * as auth from '../middlewares/auth'

const router = Router()

router.post('/sign-in', val.checkSignIn, ctrl.signIn)
router.post('/google', auth.verifyGoogleToken, ctrl.authGoogle)

export default router
