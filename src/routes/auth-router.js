import { Router } from 'express'

import { signIn } from '../controllers/auth-controller'
import { checkSignIn } from '../middlewares/validators/auth-validator'

const router = Router()

router.post('/sign-in', checkSignIn, signIn)

export default router
