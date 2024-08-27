import { checkPassword } from '../services/auth-service.js'
import jwt from 'jsonwebtoken'
import db from '../models'

const signUp = async (req, res) => {
    const username = req.body.username
    // var token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET, {
    //     expiresIn: '2 days',
    // }); 
    // await db.sequelize.authenticate()
    const date = new Date("2000-10-31T08:30:00.000+07:00")
    console.log(date)
    // console.log(date.toLocaleString("en-US", {timeZone: "+07:00"}))
    // const newUser = await db.User.create({
    //     email: 'vuongvu@gmail.com',
    //     username: 'helloworld',
    //     password: '0365466031',
    //     roleId: 10,
    //     createdAt: date,
    // })
    // console.log(typeof newUser.createdAt)
    res.status(201).send('newUser')
}

export { signUp }