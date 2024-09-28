import * as service from '../services/setting-service'

const editDBBackup = async (req, res) => {
    console.log('hello world')
    await service.updateDBBackup()
    res.sendStatus(204)
}

export { editDBBackup }
