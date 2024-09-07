import * as fileService from '../services/file-service'

const createFiles = async (req, res) => {
    const ids = await fileService.addFiles(req.files)
    res.status(201).send(ids)
}

const deleteFiles = async (req, res) => {
    res.status(200)
}

export { createFiles, deleteFiles }
