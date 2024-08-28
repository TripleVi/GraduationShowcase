import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from '../models'

async function signInWithUsernameAndPassword(username, password) {
    const user = await db.User.findOne({
        raw: true,
        where: { username: username } 
    })
    if(user) {
        const isValid = bcrypt.compareSync(password, user.password)
        if(isValid) {
            return jwt.sign(
                {
                    uid: user.id,
                    roleId: user.roleId,
                },
                process.env.JWT_SECRET,
                {
                    issuer: "greenwich",
                    expiresIn: '2 days',
                }
            )
        }
    }
    return null  
}

export { signInWithUsernameAndPassword }
