import { checkSchema, matchedData, validationResult } from 'express-validator'

import { validateId } from './validator'

const checkGet = async (req, res, next) => {
    await checkSchema({
        m: { optional: true, trim: true, notEmpty: true },
        t: { optional: true, trim: true, notEmpty: true },
        limit: { optional: true, isInt: { options: { min: 1, max: 25 } }, toInt: true },
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

const checkGetDetail = async (req, res, next) => {
    const [isValid, id] = validateId(req.params.id)
    if(isValid) {
        req.params.id = id
        return next()
    }
    res.sendStatus(404)
}

function validateDescCustom(desc) {
    const length = desc.reduce((accumulator, current) => 
            accumulator + current.content.length, 0)
    if(length > 65000) {
        throw new Error('Description length is greater than 65k characters')
    }
    return true
}

function validatePutDescCustom(desc) {
    const photoIds = []
    for(const { photoId } of desc) {
        if(photoId) {
            photoIds.push(photoId)
        }
    }
    const seen = new Set(photoIds)
    if(seen.size !== photoIds.length) {
        throw new Error('Duplicate photos')
    }
    return validateDescCustom(desc)
}

function validateTitleCustom(title) {
    return true
    const pattern = /^(?=.*?[a-zA-Z])[A-Za-z0-9_. \p{Latin}]+$/ig
    if(!pattern.test(title)) {
        throw new Error('Invalid character')
    }
}

function validateHashtagsCustom(hashtags) {
    const seen = new Set(hashtags)
    if(seen.size != hashtags.length) {
        throw new Error('Duplicate values')
    }
    return true
}

function validateAuthorsCustom(authors) {
    const seen = new Set(authors.map(a => a.email))
    if(seen.size != authors.length) {
        throw new Error('Duplicate emails')
    }
    return true
}

const checkPost = async (req, res, next) => {
    const avatarCount = req.files.avatars?.length || 0
    const photoCount = req.files.photos?.length || 0
    const avatarCheck = Array(avatarCount).fill(1)
    const photoCheck = Array(photoCount).fill(1)
    const currentYear = new Date().getFullYear()
    await checkSchema({
        title: { isString: { bail: true }, trim: true, notEmpty: { bail: true }, custom: { options: validateTitleCustom, bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        description: { isArray: { options: { min: 1, max: 20 }, bail: true }, custom: { options: validateDescCustom } },
        'description.*.title': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'description.*.content': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3 } }, escape: true },
        'description.*.fileIndex': { optional: true, isInt: { options: { min: 0, max: photoCount-1 }, bail: true }, custom: { options: value => !--photoCheck[value] } },
        year: { isInt: { options: { min: 2009, max: currentYear } } },
        videoId: { optional: true, isString: { bail: true }, trim: true, notEmpty: true, escape: true },
        topicId: { isInt: true },
        hashtags: { isArray: { options: { max: 5 }, bail: true }, custom: { options: validateHashtagsCustom } },
        'hashtags.*': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 2, max: 40 } }, escape: true },
        authors: { isArray: { options: { min: avatarCount, max: 10 }, bail: true }, custom: { options: validateAuthorsCustom } },
        'authors.*.name': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'authors.*.email': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'authors.*.fileIndex': { optional: true, isInt: { options: { min: 0, max: avatarCount-1 }, bail: true }, custom: { options: value => !--avatarCheck[value] } },
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

const checkPost2 = async (req, res, next) => {
    const photoCount = req.files.photos?.length || 0
    const avatarCount = req.files.avatars?.length || 0
    const avatarCheck = Array(avatarCount).fill(1)
    const photoCheck = Array(photoCount).fill(1)
    await checkSchema({
        paragraphIndices: { optional: !photoCount, isArray: { options: { min: photoCount, max: photoCount } } },
        'paragraphIndices.*': { isInt: { options: { min: 0 }, bail: true }, custom: { options: value => !--avatarCheck[value] } },
        authorIds: { optional: !avatarCount, isArray: { options: { min: avatarCount, max: avatarCount } } },
        'authorIds.*': { isInt: { options: { min: 1 }, bail: true }, custom: { options: value => !--photoCheck[value] } },
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
        title: { isString: { bail: true }, trim: true, notEmpty: { bail: true }, custom: { options: validateTitleCustom, bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        description: { isArray: { options: { min: 1, max: 20 }, bail: true }, custom: { options: validatePutDescCustom } },
        'description.*.title': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3, max: 250 } }, escape: true },
        'description.*.content': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 3 } }, escape: true },
        year: { isInt: { options: { min: 2009, max: 2150 } } },
        topicId: { isInt: true },
        videoId: { isString: { if: value => value !== null, bail: true }, trim: true, notEmpty: { bail: true }, escape: true },
        hashtags: { isArray: { options: { max: 5 }, bail: true }, custom: { options: validateHashtagsCustom } },
        'hashtags.*': { isString: { bail: true }, trim: true, notEmpty: { bail: true }, isLength: { options: { min: 2, max: 40 } }, escape: true },
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

export { checkGet, checkGetDetail, checkPost, checkPost2, checkPut }
