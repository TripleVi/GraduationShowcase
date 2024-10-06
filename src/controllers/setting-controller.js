import * as service from '../services/setting-service'

const editDBBackup = async (req, res) => {
    const settings = req.body
    try {
        await service.updateDBBackup(settings)
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { editDBBackup }
