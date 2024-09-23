import * as topicService from '../services/topic-service'
import * as errors from '../utils/errors'

const fetchTopics = async (req, res) => {
    const options = req.query
    try {
        const topics = await topicService.getTopics(options)
        res.status(200).send(topics)
    } catch (error) {
        switch (error.code) {
            case 'MAJOR_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const createTopic = async (req, res) => {
    try {
        const topic = req.body
        const majorId = Number(req.params.id)
        const result = await topicService.addTopic(majorId, topic)
        res.status(201).send(result)
    } catch (error) {
        switch (error.code) {
            case 'MAJOR_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'TOPIC_EXISTS':
                res.status(409).send(errors.TOPIC_EXISTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const editTopic = async (req, res) => {
    const topic = req.body
    topic.id = Number(req.params.id)
    try {
        await topicService.updateTopic(topic)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'TOPIC_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'TOPIC_EXISTS':
                res.status(409).send(errors.TOPIC_EXISTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const deleteTopic = async (req, res) => {
    try {
        const id = Number(req.params.id)
        await topicService.removeTopic(id)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'TOPIC_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'TOPIC_HAS_PROJECTS':
                res.status(409).send(errors.TOPIC_HAS_PROJECTS)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { fetchTopics, createTopic, editTopic, deleteTopic }
