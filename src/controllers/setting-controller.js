import * as service from '../services/setting-service'

import fs from 'fs'
import path from 'path'

const editDBBackup = async (req, res) => {
    const options = req.body
    try {
        const filepath = path.join(process.env.DB_BACKUP_DIR, 'graduation_showcase-1727624580094.sql')
        const stats = fs.stat().statSync(filepath)
        console.log(stats)

        return res.status(201).send(stats)
        const result = await service.updateDBBackup(options)
        // res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { editDBBackup }
