import * as authService from '../services/auth-service'
import * as authError from '../utils/errors/auth-error'

const signIn = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const token = await authService
            .signInWithUsernameAndPassword(username, password)
        if(token) {
            return res.status(200).send({ token })
        }
        res.status(401).send(authError.INVALID_CREDENTIAL)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { signIn }
