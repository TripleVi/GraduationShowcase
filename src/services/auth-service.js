import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from '../models'
import RoleEnum from '../enums/role-enum'

function generateToken(user) {
    return jwt.sign(
        {
            uid: user.id,
            roleId: user.roleId,
        },
        process.env.JWT_SECRET,
        {
            issuer: process.env.DOMAIN,
            expiresIn: '2 days',
            subject: user.id + '',
        }
    )
}

async function signInWithUsernameAndPassword(username, password) {
    const user = await db.User.findOne({
        where: { username },
    })
    if(!user) {
        throw { code: 'INVALID_CREDENTIAL' }
    }
    const isValid = bcrypt.compareSync(password, user.password)
    if(!isValid) {
        throw { code: 'INVALID_CREDENTIAL' }
    }
    return generateToken(user)
}

async function handleGoogleAuth(googleUser) {
    const { email } = googleUser
    const [user, _] = await db.User.findOrCreate({
        where: { email },
        defaults: {
            email,
            roleId: RoleEnum.USER,
        },
    })
    return generateToken(user)
}

export { signInWithUsernameAndPassword, handleGoogleAuth }
