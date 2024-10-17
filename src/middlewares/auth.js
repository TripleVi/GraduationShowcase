import { getAuth } from 'firebase-admin/auth'
import jwt from 'jsonwebtoken'

import RoleEnum from '../enums/role-enum'
import db from '../models'
import * as errors from '../utils/errors'

const verifyJWT = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader) {
        return res.sendStatus(401)
    }
    try {
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: process.env.DOMAIN,
            algorithms: 'HS256',
        })
        const { uid: id, roleId } = decoded
        const user = await db.User.findOne({
            attributes: ['id'],
            where: { id, roleId },
        })
        if(!user) {
            return res.status(401).send(errors.INVALID_CREDENTIAL)
        }
        req.User = { id, roleId }
        next()
    } catch (error) {
        switch (error.name) {
            case 'TokenExpiredError':
                res.status(401).send(errors.TOKEN_EXPIRED)
                break
            case 'JsonWebTokenError':
            case 'NotBeforeError':
                res.status(401).send(errors.INVALID_TOKEN)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const verifyGoogleToken = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader) {
        return res.sendStatus(401)
    }
    try {
        const token = authorizationHeader.split(' ')[1]
        const decoded = await getAuth().verifyIdToken(token, true)
        req.body.googleUser = decoded
        next()
    } catch (error) {
        if(!error.code) {
            console.log(error)
            return res.sendStatus(500)
        }
        switch (error.code) {
            case 'auth/id-token-expired':
            case 'auth/id-token-revoked':
                res.status(401).send(errors.TOKEN_EXPIRED)
                break
            case 'auth/user-disabled':
                res.status(401).send(errors.INVALID_CREDENTIAL)
                break
            default:
                res.status(401).send(errors.INVALID_TOKEN)
        }
    }
}

const isAdmin = (req, res, next) => {
    if(RoleEnum.ADMIN === req.User.roleId) {
        return next()
    }
    res.status(403).send({ error: 'Access denied' })
}

export { verifyJWT, verifyGoogleToken, isAdmin }
