import multer, { diskStorage } from 'multer'

const uploadProjectFiles = multer({
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
        files: 20,
        fields: 1,
    }
}).fields([
    { name: 'project' },
    { name: 'photos' },
    { name: 'report', maxCount: 1 },
])

export { uploadProjectFiles }
