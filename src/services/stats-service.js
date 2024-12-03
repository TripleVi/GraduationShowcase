import { literal } from 'sequelize'

import db from '../models'

async function getStats() {
    const result = await db.Project.findOne({
        attributes: [
            literal(`SUM(views) views`),
            literal(`SUM(likes) likes`),
        ],
        raw: true,
    })
    return result
}

export { getStats }
