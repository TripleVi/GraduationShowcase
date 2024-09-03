import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkPostTopic = async (req, res, next) => {
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

const checkPutTopic = async (req, res, next) => checkPostTopic(req, res, next)

export { checkPostTopic, checkPutTopic }
