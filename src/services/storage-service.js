import { getStorage } from 'firebase-admin/storage'

async function uploadFromLocal(path) {
    const bucket = getStorage().bucket()
    return bucket.upload(path, {
        preconditionOpts: { ifGenerationMatch: 0 },
    })
}

async function uploadFilesFromLocal(paths) {
    const bucket = getStorage().bucket()
    const uploadPromises = []
    for (const p of paths) {
        uploadPromises.push(
            bucket.upload(p, {
                preconditionOpts: { ifGenerationMatch: 0 },
            })
        )
    }
    return Promise.all(uploadPromises)
}

async function deleteFile(filename) {
    return getStorage().bucket().file(filename).delete()
}

export { uploadFromLocal, uploadFilesFromLocal, deleteFile }
