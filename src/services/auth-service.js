import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from '../models'
import RoleEnum from '../enums/role-enum'

function generateToken(user) {
    const { id: uid, name, roleId } = user
    return jwt.sign(
        { uid, name, roleId },
        process.env.JWT_SECRET,
        {
            issuer: process.env.DOMAIN,
            expiresIn: '2 days',
            subject: uid + '',
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
    const { email, name, picture } = googleUser
    const [user] = await db.User.findOrCreate({
        where: { email },
        defaults: {
            email,
            name,
            avatarUrl: picture,
            roleId: RoleEnum.USER,
        },
    })
    return generateToken(user)
}

export { signInWithUsernameAndPassword, handleGoogleAuth }
