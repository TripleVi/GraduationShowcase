import cron from 'node-cron'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

function backupTask() {
    const filename = `${process.env.DB_DATABASE}-${Date.now()}.sql`
    const filepath = path.join(process.env.DB_BACKUP_DIR, filename)
    const wstream = fs.createWriteStream(filepath);

    console.log('---------------------')
    console.log('Running Database Backup Cron Job')
    
    const mysqldump = spawn('mysqldump', [
        '-u',
        process.env.DB_USERNAME,
        '-h',
        process.env.DB_HOST,
        `-p${process.env.DB_PASSWORD}`,
        process.env.DB_DATABASE,
    ])
    
    mysqldump
        .stdout
        .pipe(wstream)
        .on('finish', function () {
            console.log('Completed')
        })
        .on('error', function (err) {
            console.log(err)
        });
}


// const backupTask = cron.schedule('* * * * *', () => {
//     console.log("hello world")
// }, {
//     scheduled: true,
//     timezone: "America/Sao_Paulo"
// })

// spawn('mysqldump', [], {env: {TZ}})

// backupTask.start()

export { backupTask }
