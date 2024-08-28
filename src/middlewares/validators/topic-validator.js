import { checkSchema, validationResult } from 'express-validator'

const checkPostTopic = async (req, res, next) => {
    await checkSchema({
        name: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            // const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_.]+$/ig
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 24 } }, escape: true },
        // majorId: { notEmpty },
    }, ['body']).run(req)
    const result = validationResult(req)
    result.isEmpty() 
        ? next() 
        : res.status(400).send({ errors: result.array() })
}

const checkPutTopic = async (req, res, next) => checkPostTopic(req, res, next)

export { checkPostTopic, checkPutTopic }
