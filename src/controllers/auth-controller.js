import * as authService from '../services/auth-service'
import * as errors from '../utils/errors'

const signIn = async (req, res) => {
    const { username, password } = req.body
    try {
        const token = await authService
            .signInWithUsernameAndPassword(username, password)
        return res.status(200).send({ token })
    } catch (error) {
        switch (error.code) {
            case 'INVALID_CREDENTIAL':
                res.status(401).send(errors.INVALID_CREDENTIAL)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const authGoogle = async (req, res) => {
    const { googleUser } = req.body
    try {
        const token = await authService.handleGoogleAuth(googleUser)
        return res.status(200).send({ token })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { signIn, authGoogle }
