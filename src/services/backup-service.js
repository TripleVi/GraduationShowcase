import fs from 'fs'
import path from 'path'

import { spawn, exec } from 'child_process'
import mime from 'mime-types'

import db from '../models'
import * as maintenanceService from './maintenance'

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

function backupDB() {
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
        addBackupFile(filename)
    })
    mysqldump.stderr.pipe(logWStream)
    mysqldump.on('close', () => {
        logWStream.write('---------------------------------------------\n')
        logWStream.end()
    })
}

async function restoreBackup(id) {
    const backup = await db.File.findOne({
        attributes: ['name'],
        where: {
            id,
            mimeType: 'application/x-sql',
            storage_type: 'local',
        }
    })
    if(!backup) {
        throw { code: 'BACKUP_NOT_EXIST' }
    }

    await maintenanceService.enableMaintenanceMode()

    const filepath = path.join(process.env.DB_BACKUP_DIR, backup.name)
    const dbRestore = `mysql -u ${process.env.DB_USERNAME} -h ${process.env.DB_HOST} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} < ${filepath}`
    exec(dbRestore, async err => {
        if(err) {
            throw err
        }
        await maintenanceService.disableMaintenanceMode()
        console.log('Database backup completed successfully')
    })
    
}

function removeOldBackups(retainDays) {
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

export { getDBBackups, removeBackup, backupDB, restoreBackup, removeOldBackups }
