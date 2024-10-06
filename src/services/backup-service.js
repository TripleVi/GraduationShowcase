import fs from 'fs'
import path from 'path'

import db from '../models'

async function getDBBackups(params) {
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = params
    const options = {
        attributes: ['id', 'name', 'size', 'mimeType'],
        where: {
            mimeType: 'application/x-sql',
            storageType: 'local',
        },
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
    }
    const { count, rows } = await db.File.findAndCountAll(options)
    return {
        data: rows,
        metadata: {
            totalItems: count,
        },
    }
}

async function removeBackup(id) {
    const backup = await db.File.findOne({
        attributes: ['id', 'name'],
        where: {
            id,
            mimeType: 'application/x-sql',
            storage_type: 'local',
        }
    })
    if(!backup) {
        throw { code: 'BACKUP_NOT_EXIST' }
    }
    const filepath = path.join(process.env.DB_BACKUP_DIR, backup.name)
    fs.unlinkSync(filepath)
    await backup.destroy()
}

async function restoreBackup(id) {
    const backup = await db.File.findOne({
        attributes: ['id'],
        where: {
            id,
            mimeType: 'application/x-sql',
            storage_type: 'local',
        }
    })
    if(!backup) {
        throw { code: 'BACKUP_NOT_EXIST' }
    }
}

export { getDBBackups, removeBackup, restoreBackup }
