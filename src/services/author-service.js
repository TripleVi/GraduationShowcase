import db from '../models'
import * as storageService from './storage-service'

async function updateAuthor(id, author) {
    const currentAuthor = await db.Author.findByPk(id)
    if(!currentAuthor) {
        throw { code: 'AUTHOR_NOT_EXIST' }
    }
    if(currentAuthor.email != author.email) {
        const emailCount = await db.Author.count({
            where: { email: author.email },
        })
        if(emailCount) {
            throw { code: 'EMAIL_EXISTS' }
        }
    }
    await currentAuthor.update(author)
}

async function updateAvatar(id, file) {
    const author = await db.Author.findByPk(id)
    if(!author) {
        throw { code: 'AUTHOR_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        file.ref = `projects/${author.projectId}/${file.filename}`
        const fileUrl = await storageService.uploadFromLocal(file)
        const newAvatar = {
            url: fileUrl,
            name: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            storageType: 'cloud',
        }
        const oldAvatar = await author.getAvatar()
        await author.createAvatar(newAvatar, { transaction })
        const fileRef = `projects/${author.projectId}/${oldAvatar.name}`
        await storageService.deleteFile(fileRef)
        await oldAvatar.destroy({ transaction })

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function deleteAuthor(id) {
    const author = await db.Author.findByPk(id)
    if(!author) {
        throw { code: 'AUTHOR_NOT_EXIST' }
    }
    const avatar = await author.getAvatar()
    const transaction = await db.sequelize.transaction()
    try {
        const fileRef = `projects/${author.projectId}/${avatar.name}`
        await storageService.deleteFile(fileRef)
        await author.destroy({ transaction })
        await avatar.destroy({ transaction })

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

export { updateAuthor, updateAvatar, deleteAuthor }
