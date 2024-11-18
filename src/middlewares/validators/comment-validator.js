import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkGet = async (req, res, next) => {
    const id = req.params.id.trim()
    if(!id) {
        return res.sendStatus(404)
    }
    req.params.id = Number(id)
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

const checkPostComment = async (req, res, next) => {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(404)
    }
    await checkSchema({
        content: { isString: true, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 3000 } }, escape: true },
        parentId: { optional: { options: { values: 'null' } }, isInt: true },
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

const checkPut = async (req, res, next) => {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(404)
    }
    await checkSchema({
        content: { isString: true, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 3000 } }, escape: true },
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

export { checkGet, checkPostComment, checkPut }
