import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkGet = async (req, res, next) => {
    await checkSchema({
        limit: { optional: true, isInt: { options: { min: 1, max: 25 } }, toInt: true },
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
    await checkSchema({
        content: { isString: true, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 1000 } }, escape: true },
    }, ['body']).run(req)
    
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

export { checkGet, checkPost }
