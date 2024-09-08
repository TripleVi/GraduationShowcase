import multer, { diskStorage, MulterError } from 'multer'

function uploadProjectFiles(req, res, next) {
    const upload = multer({
        storage: diskStorage({
            filename: (req, file, cb) => {
                const extension = file.originalname.split('.').at(-1)
                const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const filename = unique + '.' + extension
                cb(null, filename)
            },
        }),
        limits: {
            fileSize: 1024 * 1024 * 2,
            files: 31,
            fields: 1,
        }
    }).fields([
        { name: 'photos', maxCount: 20 },
        { name: 'report', maxCount: 1 },
        { name: 'avatars', maxCount: 10 },
    ])
    upload(req, res, err => {
        if(!err) {
            try {
                req.body = JSON.parse(req.body.project)
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
                break
        }
        res.status(400).send(error)
    })
}

const uploadFiles = multer({
    storage: diskStorage({
        filename: (req, file, cb) => {
            const extension = file.originalname.split('.').at(-1)
            const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const filename = unique + '.' + extension
            cb(null, filename)
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 2,
        fields: 0,
    }
}).array('data', 20)

const uploadProjectPhotos = multer({
    storage: diskStorage({
        filename: (req, file, cb) => {
            const extension = file.originalname.split('.').at(-1)
            const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const filename = unique + '.' + extension
            cb(null, filename)
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 2,
        fields: 0,
    }
}).array('photos', 20)

export { uploadProjectFiles, uploadFiles, uploadProjectPhotos }
