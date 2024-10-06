import fs from 'fs'

import config from '../../config/default.json'
import { tasks } from '../cronjobs'

async function updateDBBackup(settings) {
    config.backup.database = settings
    const jsonString = JSON.stringify(config, null, 2)
    const filepath = `${process.cwd()}/config/default.json`
    fs.writeFile(filepath, jsonString, err => {
        if(err) {
            throw err
        }
        tasks.backupTask.restart()
    })
}

export { updateDBBackup }
