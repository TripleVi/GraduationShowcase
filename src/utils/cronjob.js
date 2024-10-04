import cron from 'node-cron'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

import db from '../models'

let task

async function addBackupFile(filename) {
    const filepath = path.join(process.env.DB_BACKUP_DIR, filename)
    const stats = fs.statSync(filepath)
    const mimeType = mime.lookup(filepath)
    const values = {
        name: filename,
        originalName: filename,
        size: stats.size,
        mimeType,
    }
    await db.File.create(values)
}

function removeOldBackups() {
    const retainDays = 30
    const cutoffTime = Date.now() - retainDays*24*60*60*1000

    const filenames = fs.readdirSync(process.env.DB_BACKUP_DIR)
    filenames.forEach(file => {
        const filepath = path.join(process.env.DB_BACKUP_DIR, file)
        fs.stat(filepath, (err, stats) => {
            if(err) {
                throw err
            }
            const creationTime = stats.birthtime.getTime()
            if(creationTime < cutoffTime) {
                fs.unlink(filepath, err => {
                    if(err) {
                        throw err
                    }
                })
            }
        })
    })
}

function initBackupTask(hour) {
    return cron.schedule(`*/${hour} * * * *`, () => {
        const logWStream = fs.createWriteStream(process.env.DB_BACKUP_LOG, {
            flags: 'a',
        })
        const filename = `${process.env.DB_DATABASE}-${Date.now()}.sql`
        const filepath = path.join(process.env.DB_BACKUP_DIR, filename)
        const dbWStream = fs.createWriteStream(filepath)
        const mysqldump = spawn('mysqldump', [
            '-u',
            process.env.DB_USERNAME,
            '-h',
            process.env.DB_HOST,
            `-p${process.env.DB_PASSWORD}`,
            process.env.DB_DATABASE,
        ])
        let dataWritten = false
        logWStream.write(`Starting backup [${new Date().toISOString()}]\n`)
        mysqldump.stdout.once('data', () => dataWritten = true)
        mysqldump.stdout.pipe(dbWStream).on('finish', () => {
            if(!dataWritten) {
                return fs.unlink(filepath, err => {
                    if(err) {
                        throw err
                    }
                })
            }
            logWStream.write(`Sql dump created\n`)
            logWStream.write(`Backup complete [${new Date().toISOString()}]\n`)
            console.log('complete')
            addBackupFile(filename)
            removeOldBackups()
        })
        mysqldump.stderr.on('data', err => logWStream.write(err))
        mysqldump.on('close', () => {
            logWStream.write('---------------------------------------------\n')
            logWStream.end()
        })
    }, {
        scheduled: false,
        timezone: 'UTC',
    })
}

function initCronJobs() {
    if(task) {
        throw new Error('Cron jobs was initialized')
    }
    task = initBackupTask(2)
    task.start()
}


function scheduleTask(options) {
    const { hours, interval, retainDays } = options
    let hour = 3
    if(hours) {
        hour = hours.length == 1 ? hours[0] : hours.join(',')
    }else if(interval) {
        hour = `*/${interval}`
    }
    task.stop()
    task = initBackupTask(hour)
    task.start()
}

export { initCronJobs, scheduleTask }
