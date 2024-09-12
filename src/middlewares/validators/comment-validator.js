import { checkSchema, matchedData, validationResult } from 'express-validator'

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

export { checkPostComment }
