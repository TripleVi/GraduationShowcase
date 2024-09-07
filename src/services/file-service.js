import { getStorage } from 'firebase-admin/storage'

import db from '../models'

async function addFiles(files) {
    const bucket = getStorage().bucket()
    const createdIds = []
    for (const f of files) {
        const response = await bucket.upload(f.path, (err, file, apiResponse) => {
            
        })
        const metadata = response['0'].metadata
        const file = {
            url: metadata.selfLink,
            name: metadata.name,
            originalName: metadata.name,
            size: metadata.size,
            mimeType: metadata.contentType
        }
        const created = await db.File.create(file)
        createdIds.push(created.dataValues.id)
    }
    return createdIds
    // console.log(bucket.upload())
}

export { addFiles }
