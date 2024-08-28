import * as authService from '../services/auth-service'
import * as error from '../utils/errors'

const signIn = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const token = await authService
            .signInWithUsernameAndPassword(username, password)
        if(token) {
            return res.status(200).send({ token })
        }
        res.status(401).send(error.INVALID_CREDENTIAL)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { signIn }
