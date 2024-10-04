import * as service from '../services/setting-service'

const editDBBackup = async (req, res) => {
    const options = req.body
    try {
        removeOldBackups()
        return res.status(201).send({})
        const result = await service.updateDBBackup(options)
        // res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { editDBBackup }
