import * as majorService from '../services/major-service'
import * as errors from '../utils/errors'

const fetchMajors = async (req, res) => {
    try {
        const options = req.query
        const majors = await majorService.getMajors(options)
        res.status(200).send(majors)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const createMajor = async (req, res) => {
    const major = req.body
    try {
        const result = await majorService.addMajor(major)
        res.status(201).send(result)
    } catch (error) {
        switch (error.code) {
            case 'MAJOR_EXISTS':
                res.status(400).send(errors.MAJOR_EXISTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const editMajor = async (req, res) => {
    const major = req.body
    major.id = Number(req.params.id)
    try {
        await majorService.updateMajor(major)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'MAJOR_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'MAJOR_EXISTS':
                res.status(400).send(errors.MAJOR_EXISTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const deleteMajor = async (req, res) => {
    try {
        const id = req.params.id
        await majorService.removeMajor(id)
    } catch (error) {
        switch (error.code) {
            case 'MAJOR_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'MAJOR_HAS_TOPICS':
                res.status(409).send(errors.MAJOR_HAS_TOPICS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { fetchMajors, createMajor, editMajor, deleteMajor }
