import { getStorage, getDownloadURL } from 'firebase-admin/storage'

async function uploadFromLocal(file) {
    const bucket = getStorage().bucket()
    const [uploaded] = await bucket.upload(file.path, {
        destination: file.ref,
        preconditionOpts: { ifGenerationMatch: 0 },
    })
    return getDownloadURL(uploaded)
}

function uploadFilesFromLocal(files) {
    const uploadPromises = files.map(f => uploadFromLocal(f))
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

export { uploadFromLocal, uploadFilesFromLocal, deleteFile, deleteFiles, deleteFolder }
