import { Router } from 'express'

import { signUp } from '../controllers/auth-controller.js'

const router = Router()

router.get('/sign-up', signUp)

export default router
