import * as majorService from '../services/major-service'
import * as error from '../utils/errors'

const fetchMajors = async (req, res) => {
    try {
        const majors = await majorService.getMajors()
        res.status(200).send(majors)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const createMajor = async (req, res) => {
    try {
        const newMajor = req.body
        const major = await majorService.getMajorByName(newMajor.name)
        if(major) {
            return res.status(409).send(error.MAJOR_EXISTS)
        }
        const created = await majorService.addMajor(newMajor)
        res.status(201).send(created)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const editMajor = async (req, res) => {
    try {
        const newMajor = req.body
        const id = req.params.id
        const major = await majorService.getMajorById(id)
        if(!major) {
            return res.sendStatus(404)
        }
        const isSuccess = await majorService.updateMajor(id, newMajor)
        res.sendStatus(isSuccess ? 204 : 409)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const deleteMajor = async (req, res) => {
    try {
        const id = req.params.id
        const major = await majorService.getMajorById(id)
        if(!major) {
            return res.sendStatus(404)
        }
        const isSuccess = await majorService.removeMajor(id)
        res.sendStatus(isSuccess ? 204 : 409)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { fetchMajors, createMajor, editMajor, deleteMajor }
