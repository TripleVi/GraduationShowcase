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

export { fetchDBBackups }
