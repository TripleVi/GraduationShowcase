import { checkSchema, validationResult } from 'express-validator'

const checkPostMajor = async (req, res, next) => {
    console.log('hello world')
    await checkSchema({
        name: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            // const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_.]+$/ig
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 24 } }, escape: true },
    }, ['body']).run(req)
    const result = validationResult(req)
    result.isEmpty() 
        ? next() 
        : res.status(400).send({ errors: result.array() })
}

const checkPutMajor = async (req, res, next) => checkPostMajor(req, res, next)

export { checkPostMajor, checkPutMajor }
