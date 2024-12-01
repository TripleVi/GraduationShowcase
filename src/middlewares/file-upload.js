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
    'avatar': 'image',
    'thumbnail': 'image',
}

function filename(_, file, cb) {
    const extension = file.originalname.split('.').at(-1)
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const filename = unique + '.' + extension
    cb(null, filename)
}

function validateFiles(files) {
    for (const file of files) {
        const { mimeTypes, maxSize } = types[typesForFileFields[file.fieldname]]
        if(!mimeTypes.includes(file.mimetype)) {
            return {
                code: 'INVALID_MIMETYPE',
                field: file.fieldname,
                message: `Only ${mimeTypes.join(',')} accepted`,
            }
        }
        if(file.size > maxSize) {
            return {
                code: 'LIMIT_FILE_SIZE',
                field: file.fieldname,
                message: `Maximum file size is ${maxSize/1024/1024} MB`
            }
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
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            files: 32,
            fields: 1,
        },
    }).fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'photos', maxCount: 20 },
        { name: 'report', maxCount: 1 },
        { name: 'avatars', maxCount: 10 },
    ])

    upload(req, res, err => {
        if(err) {
            if(err instanceof MulterError) {
                const error = handleMulterError(err)
                return res.status(400).send(error)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        const files = []
        for (const key in req.files) {
            files.push(...req.files[key])
        }
        const error = validateFiles(files)
        if(error) {
            return res.status(400).send(error)
        }
        try {
            req.body = JSON.parse(req.body.project)
            next()
        } catch (error) {
            res.sendStatus(400)
        }
    })
}

function uploadProjectFiles2(req, res, next) {
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            files: 32,
            fields: 2,
        },
    }).fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'photos', maxCount: 20 },
        { name: 'report', maxCount: 1 },
        { name: 'avatars', maxCount: 10 },
    ])

    upload(req, res, err => {
        if(err) {
            if(err instanceof MulterError) {
                const error = handleMulterError(err)
                return res.status(400).send(error)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        const files = []
        for (const key in req.files) {
            files.push(...req.files[key])
        }
        const error = validateFiles(files)
        if(error) {
            return res.status(400).send(error)
        }
        try {
            const { paragraphIndices, authorIds } = req.body
            if(paragraphIndices) {
                req.body.paragraphIndices = JSON.parse(paragraphIndices)
            }
            if(authorIds) {
                req.body.authorIds = JSON.parse(authorIds)
            }
            next()
        } catch (error) {
            res.sendStatus(400)
        }
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
            files: 1,
            fields: 0,
        },
    }).single('report')
    upload(req, res, err => {
        if(err) {
            if(err instanceof MulterError) {
                const error = handleMulterError(err)
                return res.status(400).send(error)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        if(!req.file) {
            return res.status(400).send({
                code: 'INVALID_VALUE',
                location: 'body',
                field: 'report',
            })
        }
        const error = validateFiles([req.file])
        if(error) {
            return res.status(400).send(error)
        }
        next()
    })
}

function uploadAvatars(req, res, next) {
    const upload = multer({
        storage: diskStorage({ filename }),
        limits: {
            files: 10,
            fields: 1,
        }
    }).array('avatars', 10)
    upload(req, res, err => {
        if(err) {
            if(err instanceof MulterError) {
                const error = handleMulterError(err)
                return res.status(400).send(error)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        const error = validateFiles(req.files)
        if(error) {
            return res.status(400).send(error)
        }
        try {
            req.body = JSON.parse(req.body.authors)
            next()
        } catch (error) {
            res.sendStatus(400)
        }
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
            files: 1,
            fields: 0,
        }
    }).single('avatar')
    upload(req, res, err => {
        if(err) {
            if(err instanceof MulterError) {
                const error = handleMulterError(err)
                return res.status(400).send(error)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        if(!req.file) {
            return res.status(400).send({
                code: 'INVALID_VALUE',
                location: 'body',
                field: 'avatar',
            })
        }
        const error = validateFiles([req.file])
        if(error) {
            return res.status(400).send(error)
        }
        next()
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
            files: 20,
            fields: 0,
        }
    }).array('photos', 20)
    upload(req, res, err => {
        if(err) {
            if(err instanceof MulterError) {
                const error = handleMulterError(err)
                return res.status(400).send(error)
            }
            console.log(err)
            return res.sendStatus(500)
        }
        if(!req.files) {
            return res.status(400).send({
                code: 'INVALID_VALUE',
                location: 'body',
                field: 'photos',
            })
        }
        const error = validateFiles(req.files)
        if(error) {
            return res.status(400).send(error)
        }
        next()
    })

}

export { uploadProjectFiles, uploadProjectFiles2, uploadReport, uploadAvatars, uploadAvatar, uploadPhotos }
