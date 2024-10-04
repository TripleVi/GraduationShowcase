import * as service from '../services/setting-service'

const editDBBackup = async (req, res) => {
    const options = req.body
    try {
        return res.status(201).send(values)
        const result = await service.updateDBBackup(options)
        // res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { editDBBackup }
