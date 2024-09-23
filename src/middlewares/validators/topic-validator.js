import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkGet = async (req, res, next) => {
    await checkSchema({
        m: { optional: true, trim: true, notEmpty: true },
        limit: { optional: true, isInt: { options: { min: 0, max: 25 } }, toInt: true },
        offset: { optional: true, isInt: { options: { min: 0 } }, toInt: true },
    }, ['query']).run(req)
    
    const result = validationResult(req)
    if(!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() })
    }
    const obj = matchedData(req, { locations: ['query'], includeOptionals: true })
    const objKeys = Object.keys(obj)
    const fields = new Set([...objKeys, ...Object.keys(req.query)])
    fields.size === objKeys.length
        ? next() 
        : res.sendStatus(400)
}

const checkPost = async (req, res, next) => {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(404)
    }
    await checkSchema({
        name: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            // const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_.]+$/ig
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 24 } }, escape: true },
    }, ['body']).run(req)

    const result = validationResult(req)
    if(!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() })
    }
    const obj = matchedData(req, { locations: ['body'], includeOptionals: true })
    const objKeys = Object.keys(obj)
    const fields = new Set([...objKeys, ...Object.keys(req.body)])
    fields.size === objKeys.length
        ? next() 
        : res.sendStatus(400)
}

const checkPut = async (req, res, next) => checkPost(req, res, next)

const checkDelete = (req, res, next) => {
    const id = req.params.id.trim()
    const pattern = /^\d+$/
    if(pattern.test(id)) {
        req.params.id = parseInt(id)
        return next()
    }
    res.sendStatus(404)
}

export { checkGet, checkPost, checkPut, checkDelete }
