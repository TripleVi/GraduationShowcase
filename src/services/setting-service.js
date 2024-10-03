import db from '../models'
// import { scheduleTask } from '../utils/cronjob'

async function updateDBBackup(setting) {
    const backup = await db.AppSetting.findOne({
        attributes: ['id', 'value'],
        where: { type: 'backup' },
    })
    const value = backup.value
    value.database = setting
    await backup.update({ value })
    // scheduleTask(options)
}

export { updateDBBackup }
