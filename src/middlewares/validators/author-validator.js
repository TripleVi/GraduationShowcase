import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkPut = async (req, res, next) => {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(404)
    }
    req.params.id = Number(req.params.id)
    await checkSchema({
        authors: { isArray: { options: { min: 1 } } },
        'authors.*.id': { isInt: true },
        'authors.*.name': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'authors.*.email': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
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

export { checkPut }
