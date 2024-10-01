import { checkSchema, matchedData, validationResult } from 'express-validator'

const checkPutDBBackup = async (req, res, next) => {
    if(req.body.hours && req.body.interval) {
        return res.status(400).send({
            error: 'Only one of the two attributes: hours or interval'
        })
    }
    await checkSchema({
        hours: { optional: true, isArray: { options: { min: 1, max: 24 }, bail: true }, custom: { options: values => {
            const seen = new Set(values)
            if(seen.size == values.length) {
                return true
            }
            throw new Error('Duplicate values')
        } } },
        'hours.*': { isInt: { options: { min: 0, max: 23 } } },
        interval: { optional: true, isInt: { options: { min: 0 } } },
        retainDays: { isInt: { options: { min: 0 } } },
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

export { checkPutDBBackup }
