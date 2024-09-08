import { getStorage } from 'firebase-admin/storage'

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

export { uploadFilesFromLocal }
