import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkPostProject = async (req, res, next) => {
    const avatarCount = req.files.avatars.length
    const count = Array(avatarCount).fill(1)
    await checkSchema({
        title: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_. ]+$/ig
            if(!pattern.test(value)) {
                throw new Error('Invalid character')
            }
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        description: { trim: true, notEmpty: { bail: true }, custom: { options: value => {
            const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_. ()]+$/ig
            if(!pattern.test(value)) {
                throw new Error('Invalid character')
            }
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 65000 } }, escape: true },
        year: { isInt: { options: { min: 2009, max: 2150 } } },
        videoId: { optional: true, trim: true, notEmpty: { bail: true }, escape: true },
        topicId: { isInt: true },
        hashtags: { isArray: { options: { max: 5 }, bail: true }, custom: { options: values => {
            const uniqueValues = new Set(values)
            if(uniqueValues.size != values.length) {
                throw new Error('Duplicate values')
            }
            return true
        } } },
        'hashtags.*': { trim: true, notEmpty: { bail: true }, isLength: { options: { min: 2, max: 40 } }, escape: true },
        authors: { isArray: { options: { min: avatarCount, max: 10 } }, custom: { options: values => {
            const uniqueValues = new Set(values.map(v => v.email))
            if(uniqueValues.size != values.length) {
                throw new Error('Duplicate emails')
            }
            return true
        } } },
        'authors.*.name': { trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'authors.*.email': { trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'authors.*.fileIndex': { optional: true, isInt: { options: { min: 0, max: avatarCount-1 }, bail: true }, custom: { options: value => !--count[value], bail: true } },
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

const checkPutProject = async (req, res, next) => {
    await checkSchema({
        title: { isString: true, trim: true, notEmpty: { bail: true }, custom: { options: value => {
            const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_. ]+$/ig
            if(!pattern.test(value)) {
                throw new Error('Invalid character')
            }
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        description: { isString: true, trim: true, notEmpty: { bail: true }, custom: { options: value => {
            const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_. ()]+$/ig
            if(!pattern.test(value)) {
                throw new Error('Invalid character')
            }
            return true
        }, bail: true }, isLength: { options: { min: 3, max: 65000 } }, escape: true },
        year: { isInt: { options: { min: 2009, max: 2150 } } },
        videoId: { isString: { if: value => value !== null, bail: true }, trim: true, notEmpty: { bail: true }, escape: true },
        topicId: { isInt: true },
        hashtags: { isArray: { options: { max: 5 }, bail: true }, custom: { options: values => {
            const uniqueValues = new Set(values)
            if(uniqueValues.size != values.length) {
                throw new Error('Duplicate values')
            }
            return true
        } } },
        'hashtags.*': { trim: true, notEmpty: { bail: true }, isLength: { options: { min: 2, max: 40 } }, escape: true },
        id: { in: 'params', trim: true },
    }, ['body']).run(req)

    const result = validationResult(req)
    if(!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() })
    }
    const obj = matchedData(req, { locations: ['body'], includeOptionals: true })
    const objKeys = Object.keys(obj)
    const fields = new Set([...objKeys, ...Object.keys(req.body)])
    if(fields.size !== objKeys.length) {
        res.sendStatus(400)
    }else if(!req.params.id) {
        res.sendStatus(404)
    }else {
        next()
    } 
}

export { checkPostProject, checkPutProject }
