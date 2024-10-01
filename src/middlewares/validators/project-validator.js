import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkGet = async (req, res, next) => {
    await checkSchema({
        m: { optional: true, trim: true, notEmpty: true },
        t: { optional: true, trim: true, notEmpty: true },
        limit: { optional: true, isInt: { options: { min: 0, max: 25 } }, toInt: true },
        offset: { optional: true, isInt: { options: { min: 0 } }, toInt: true },
        sort: { optional: true, trim: true, notEmpty: { bail: true }, toLowerCase: true, custom: { options: value => {
            const fields = ['year', 'views', 'likes']
            const pattern = /^([+-]?)([a-zA-Z][a-zA-Z_]*[a-zA-Z])$/
            const results = value.match(pattern)
            if(!results || !fields.includes(results[2])) {
                return false
            }
            if(!results[1]) {
                req.query.sort = '+' + req.query.sort
            }
            return true
        } } },
        search: { optional: true, trim: true, notEmpty: true },
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
    const avatarCount = req.files.avatars?.length || 0
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
            const seen = new Set(values)
            if(seen.size == values.length) {
                return true
            }
            throw new Error('Duplicate values')
        } } },
        'hashtags.*': { trim: true, notEmpty: { bail: true }, isLength: { options: { min: 2, max: 40 } }, escape: true },
        authors: { isArray: { options: { min: avatarCount, max: 10 } }, custom: { options: values => {
            const seen = new Set(values.map(v => v.email))
            if(seen.size == values.length) {
                return true
            }
            throw new Error('Duplicate emails')
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

const checkPut = async (req, res, next) => {
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
        topicId: { isInt: true },
        videoId: { isString: { if: value => value !== null, bail: true }, trim: true, notEmpty: { bail: true }, escape: true },
        hashtags: { isArray: { options: { max: 5 }, bail: true }, custom: { options: values => {
            const seen = new Set(values)
            if(seen.size == values.length) {
                return true
            }
            throw new Error('Duplicate values')
        } } },
        'hashtags.*': { trim: true, notEmpty: { bail: true }, isLength: { options: { min: 2, max: 40 } }, escape: true },
        id: { in: 'params', trim: true, toInt: true },
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

export { checkGet, checkPost, checkPut }
