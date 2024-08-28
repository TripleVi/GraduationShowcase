import * as authServices from '../services/auth-service'
import * as authErrors from '../utils/errors/auth-errors'

const signIn = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const token = await authServices
            .signInWithUsernameAndPassword(username, password)
        if(token) {
            return res.status(200).send({ token })
        }
        res.status(401).send(authErrors.INVALID_CREDENTIAL)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { signIn }
