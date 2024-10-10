import * as backupService from '../services/backup-service'

const fetchDBBackups = async (req, res) => {
    try {
        const options = req.query
        const backups = await backupService.getDBBackups(options)
        res.send(backups)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const deleteBackup = async (req, res) => {
    try {
        const id = req.params.id
        await backupService.removeBackup(id)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'BACKUP_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const restoreBackup = async (req, res) => {
    try {
        const id = req.params.id
        await backupService.restoreBackup(id)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'BACKUP_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { fetchDBBackups, deleteBackup, restoreBackup }
