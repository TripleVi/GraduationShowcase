import { checkPassword } from '../services/auth-service.js'
import jwt from 'jsonwebtoken'
// import db from '../models/author.js'

function signUp(req, res) {
    const username = req.body.username
    // var token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET, {
    //     expiresIn: '2 days',
    // });
    res.send('hello world')
}

export { signUp }