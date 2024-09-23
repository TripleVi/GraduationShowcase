import jwt from 'jsonwebtoken'

import RoleEnum from '../enums/role-enum'
import db from '../models'
import * as errors from '../utils/errors'

const verifyJWT = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader) return res.sendStatus(401)
    try {
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'greenwich',
            algorithms: 'HS256',
        })
        const { uid, roleId } = decoded
        if(!uid || !roleId) {
            throw new Error('Invalid token')
        }
        const count = await db.User.count({ where: { id: uid, roleId } })
        if(!count) {
            throw new Error('Invalid token')
        }
        req.User = {
            uid: decoded.uid,
            roleId: decoded.roleId,
        }
        next()
    } catch (error) {
        res.status(401).send(errors.INVALID_TOKEN)
    }
}

const isAdmin = (req, res, next) => {
    if(RoleEnum.ADMIN === req.User.roleId) {
        return next()
    }
    res.status(403).send({ error: 'Access denied' })
}

export { verifyJWT, isAdmin }
