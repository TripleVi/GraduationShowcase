import db from '../models'

async function getChats(uid) {
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
    const { count, rows } = await db.Chat.findAndCountAll(options)
    return {
        data: rows,
        metadata: {
            totalItems: count,
        },
    }
}

export { getChats }
