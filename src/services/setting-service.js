import db from '../models'
import { scheduleTask } from '../utils/cronjob'

async function updateDBBackup(options) {
    scheduleTask(options)
}

export { updateDBBackup }
