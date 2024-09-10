import { getStorage } from 'firebase-admin/storage'

async function uploadFromLocal(path) {
    const bucket = getStorage().bucket()
    return bucket.upload(path, {
        preconditionOpts: { ifGenerationMatch: 0 },
    })
}

async function testUpload(file) {
    const bucket = getStorage().bucket()
    // bucket.deleteFiles({force})
    const result = await bucket.deleteFiles({ prefix: 'project' })
    console.log('----------------------')
    console.log(result)
    console.log('----------------------')
    return
    const response = await bucket.upload(file.path, {
        destination: `project2/author/${file.filename}`,
        preconditionOpts: { ifGenerationMatch: 0 },
    })
    console.log(response)
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
    // for (const f of files) {
    //     uploadPromises.push(
    //         bucket.upload(f.path, {
    //             destination: f.destination,
    //             preconditionOpts: { ifGenerationMatch: 0 },
    //         })
    //     )
    // }
    return Promise.all(uploadPromises)
}

async function deleteFile(fileRef) {
    return getStorage().bucket().file(fileRef).delete()
}

async function deleteFiles(fileRefs) {
    const bucket = getStorage().bucket()
    const deletePromises = fileRefs.map(ref => bucket.file(ref).delete())
    return Promise.all(deletePromises)
}

async function deleteFolder(folderRef) {
    const bucket = getStorage().bucket()
    return bucket.deleteFiles({ prefix: folderRef, force: true })
}

export { uploadFromLocal, uploadFilesFromLocal, deleteFile, deleteFiles, deleteFolder, testUpload }
