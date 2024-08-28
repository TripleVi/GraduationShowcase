import jwt from 'jsonwebtoken'

import RoleEnum from '../enums/role-enum'

const verifyJWT = (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader) return res.sendStatus(401)
    try {
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'greenwich',
            algorithms: 'HS256',
        })
        req.User = {
            uid: decoded.uid,
            roleId: decoded.roleId,
        }
        next()
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' })
    }
}

const isAdmin = (req, res, next) => {
    if(RoleEnum.ADMIN === req.User.uid) return next()
    res.status(403).send({ error: 'Access denied' })
}

export { verifyJWT, isAdmin }
