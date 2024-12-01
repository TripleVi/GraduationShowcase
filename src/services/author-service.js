import { Op } from 'sequelize'

import db from '../models'
import * as storageService from './storage-service'

async function updateAuthorGroup(id, authors) {
    const project = await db.Project.findByPk(id, {
        attributes: ['id'],
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const ids = authors.map(a => a.id)
    const count = await db.Author.count({
        where: { id: { [Op.in]: ids } },
    })
    if(count != ids.length) {
        throw { code: 'AUTHOR_NOT_EXIST' }
    }
    // const emails = authors.map(a => a.email)
    // const results = await db.Author.count({
    //     where: { email: { [Op.in]: emails } },
    // })
    const updatePromises = []
    for (const { id, ...values } of authors) {
        updatePromises.push(
            db.Author.update(values, {
                where: { id },
            })
        )
    }
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
