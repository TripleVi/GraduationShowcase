import db from '../models'
import * as storageService from './storage-service'

async function updateAuthorGroup(id, authors) {
    const project = await db.Project.findByPk(id, {
        attributes: ['id'],
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const authorIds = authors.map(a => a.id)
    const currentAuthors = await project.getAuthors({
        where: { id: authorIds },
    })
    if(currentAuthors.length != authorIds.length) {
        throw { code: 'AUTHOR_NOT_EXIST' }
    }
    // Check email
    // const emails = authors.map(a => a.email)
    // const temp = await db.Author.findAll({
    //     where: { id: emails },
    // })
    const updatePromises = currentAuthors.map((a, i) => {
        const { id, ...values } = authors[i]
        return a.update(values)
    })
    await Promise.all(updatePromises)
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

export { updateAuthorGroup, updateAvatar, deleteAuthor }
