import { checkSchema, validationResult } from 'express-validator'

import * as error from '../../utils/errors'

const checkPostProject = async (req, res, next) => {
    await checkSchema({
        username: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            // Username must contain valid characters and at least one letter.
            const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_.]+$/ig
            if(!pattern.test(value)) {
                throw new Error('Invalid username')
            }
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 24 } }, escape: true },
        password: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            // Password must contain valid characters and at least one lowercase letter, one uppercase letter, one digit, and one special character.
            const pattern2 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_{|}~])[A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_{|}~]+$/ig
            if(!pattern2.test(value)) {
                throw new Error('Invalid password')
            }
            return true
        }, bail: true }, isLength: { options: { min: 8, max: 50 } }, escape: true },
    }, ['body']).run(req)
    const result = validationResult(req)
    result.isEmpty() ? next() : res.status(400).send(error.INVALID_CREDENTIAL)
}

export { checkPostProject }
