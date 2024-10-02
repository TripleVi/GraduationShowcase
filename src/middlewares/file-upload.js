import multer, { diskStorage, MulterError } from 'multer'

const types = {
    'image': {
        maxSize: 1024 * 1024 * 2,
        mimeTypes: [
            'image/png',
            'image/jpeg',
        ]
    },
    'report': {
        maxSize: 1024 * 1024 * 10,
        mimeTypes: [
            'application/pdf',
        ]
    },
}

const typesForFileFields = {
    'photos': 'image',
    'report': 'report',
    'avatars': 'image',
}

function filename(_, file, cb) {
    const extension = file.originalname.split('.').at(-1)
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = unique + '.' + extension
    cb(null, filename)
}

function fileFilter(req, file, cb) {
    const { mimeTypes } = types[typesForFileFields[file.fieldname]]
    if(mimeTypes.includes(file.mimetype)) {
        return cb(null, true)
    }
    console.log(file)
    cb('null', false)
}

function checkFileSizes(files) {
    for (const file of files) {
        const { maxSize } = types[typesForFileFields[file.fieldname]]
        if(file.size <= maxSize) {
            continue
        }
        return {
            code: 'LIMIT_FILE_SIZE',
            field: file.fieldname,
            message: `Maximum file size is ${maxSize/1024/1024} MB`
        }
    }
}

function handleMulterError(err) {
    const { code, message, field } = err
    let error
    switch (code) {
        case 'LIMIT_FIELD_COUNT':
            error = { code, message }
            break
        case 'LIMIT_FILE_COUNT':
            error = { code, message }
            break
        case 'LIMIT_UNEXPECTED_FILE':
            error = { code, field, message }
            break
        case 'LIMIT_FILE_SIZE':
            error = { code, field, message }
            if(field == 'report') {
                error.message = 'Maximum file size is 10 MB'
            }else if(field == 'photos') {
                error.message = 'Maximum file size is 2 MB'
            }
            break
        default:
            error = { code, message }
    }
    return error
}

function uploadProjectFiles(req, res, next) {
    let error
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            files: 31,
            fields: 1,
        },
        fileFilter: (_, file, cb) => {
            if(error) return cb(error, false)

            console.log(file)
            if(file.mimetype === 'image/jpeg') {
                error = {code:'error'}
                console.log(file.originalname)
                return cb(error, false)
            }
            cb(null, true)
        },
    }).fields([
        { name: 'photos', maxCount: 20 },
        { name: 'report', maxCount: 1 },
        { name: 'avatars', maxCount: 10 },
    ])

    upload(req, res, err => {
        console.log(req.files)
        console.log(err)
        if(!err) {
            console.log('req.files')
            return res.sendStatus(204)
            const files = []
            for (const e in req.files) {
                files.push(...e)
            }
            const error = checkFileSizes(files)
            if(error) {
                return res.status(400).send(error)
            }
            try {
                req.body = JSON.parse(req.body.project)
                next()
            } catch (error) {
                res.sendStatus(400)
            }
            return
        }
        return res.status(400).send('error')
        if(!(err instanceof MulterError)) {
            console.log(err)
            return res.sendStatus(204)
        }
        // const error = handleMulterError(err)
    })
}

function uploadReport(req, res, next) {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(400)
    }
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            fileSize: 1,
            files: 1,
            fields: 0,
        },
        fileFilter: (_, file, cb) => {
            if(!types.report.mimetype.includes(file.mimetype)) {
                
            }
            if(file.mimetype != 'application/pdf') {
                cb(null, false)
            }
            cb(null, true)
        },
    }).single('report')
    upload(req, res, err => {
        if(!err) {
            console.log(req.file)
            return res.sendStatus(204)
            return next()
        }
        if(!(err instanceof MulterError)) {
            console.log(err)
            return res.sendStatus(500)
        }
        const error = handleMulterError(err)
        res.status(400).send(error)
    })
}

function uploadAvatars(req, res, next) {
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            fileSize: 1024 * 1024 * 2,
            files: 10,
            fields: 1,
        }
    }).array('avatars', 10)
    upload(req, res, err => {
        if(!err) {
            try {
                req.body = JSON.parse(req.body.authors)
                next()
            } catch (error) {
                res.sendStatus(400)
            }
            return
        }
        if(!(err instanceof MulterError)) {
            console.log(err)
            return res.sendStatus(500)
        }
        const error = handleMulterError(err)
        res.status(400).send(error)
    })
}

function uploadAvatar(req, res, next) {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(404)
    }
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            fileSize: 1024 * 1024 * 2,
            files: 1,
            fields: 0,
        }
    }).single('avatar')
    upload(req, res, err => {
        if(!err) {
            return next()
        }
        if(!(err instanceof MulterError)) {
            console.log(err)
            return res.sendStatus(500)
        }
        const error = handleMulterError(err)
        res.status(400).send(error)
    })
}

function uploadPhotos(req, res, next) {
    req.params.id = req.params.id.trim()
    if(!req.params.id) {
        return res.sendStatus(404)
    }
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            fileSize: 1024 * 1024 * 2,
            files: 20,
            fields: 0,
        }
    }).array('photos', 20)
    upload(req, res, err => {
        if(!err) {
            return req.files ? next() : res.sendStatus(400)
        }
        if(!(err instanceof MulterError)) {
            console.log(err)
            return res.sendStatus(500)
        }
        const error = handleMulterError(err)
        res.status(400).send(error)
    })
}

export { uploadProjectFiles, uploadReport, uploadAvatars, uploadAvatar, uploadPhotos }
