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
    try {
        const newTopic = req.body
        const id = req.params.id
        let topic = await topicService.getTopicById(id)
        if(!topic) {
            return res.sendStatus(404)
        }
        topic = await topicService.getTopicByName(newTopic.name)
        if(topic && topic.id != id) {
            return res.status(409).send(error.TOPIC_EXISTS)
        }
        const isSuccess = await topicService.updateTopic(id, newTopic)
        res.sendStatus(isSuccess ? 204 : 409)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const deleteTopic = async (req, res) => {
    try {
        const id = req.params.id
        const topic = await topicService.getTopicById(id)
        if(!topic) {
            return res.sendStatus(404)
        }
        const isSuccess = await topicService.removeTopic(id)
        isSuccess 
            ? res.sendStatus(204) 
            : res.status(409).send(error.TOPIC_HAS_PROJECTS)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { fetchTopics, createTopic, editTopic, deleteTopic }
