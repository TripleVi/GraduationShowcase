import cron from 'node-cron'

import * as backupService from '../services/backup-service'
import config from '../../config/default.json'

const scheduleOptions = {
    scheduled: false,
    timezone: 'UTC',
}

function initCleanupTask() {
    const task = cron.schedule('0 20 * * *', () =>  {
        const retainDays = config.backup.database.retainDays
        backupService.removeOldBackups(retainDays)
    }, scheduleOptions)
    task.start()
    return task
}

function initBackupTask() {
    const { hours, interval } = config.backup.database
    let hour = 20
    if(hours) {
        hour = hours.length == 1 ? hours[0] : hours.join(',')
    }else if(interval) {
        hour = `*/${interval}`
    }
    const task = cron.schedule(`0 ${hour} * * *`, () => {
        backupService.backupDB()
    }, scheduleOptions)
    task.start()
    return task
}

function scheduleTasks() {
    const backupTask = {
        task: initBackupTask(),
        restart: function() {
            this.task.stop()
            this.task = initBackupTask()
            this.task.start()
        }
    }
    const cleanupTask = {
        task: initCleanupTask(),
        restart: function() {
            this.task.stop()
            this.task = initCleanupTask()
            this.task.start()
        }
    }
    return { backupTask, cleanupTask }
}

export default scheduleTasks
