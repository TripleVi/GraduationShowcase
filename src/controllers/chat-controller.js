import * as chatService from '../services/chat-service'
import * as errors from '../utils/errors'

const fetchChats = async (req, res) => {
    const options = req.query
    const { uid } = req.User
    try {
        const chats = await chatService.getChats(uid, options)
        res.status(200).send(chats)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const fetchMessages = async (req, res) => {
    const options = req.query
    const chatId = Number(req.params.id)
    const { uid } = req.User
    try {
        const messages = await chatService.getMessages(chatId, uid, options)
        res.status(200).send(messages)
    } catch (error) {
        switch (error.code) {
            case 'CHAT_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const createChat = async (req, res) => {
    const data = {
        userId: req.User.uid,
        ...req.body,
    }
    try {
        const result = await chatService.addChat(data)
        res.setHeader('Content-Type', result.headers['content-type'])
        // res.setHeader('Connection', result.headers['connection'])
        res.setHeader('Cache-Control', result.headers['cache-control'])
        res.status(result.status)
        result.data.pipe(res)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const createMessage = async (req, res) => {
    const params = {
        userId: req.User.uid,
        chatId: Number(req.params.id),
        data: req.body,
    }
    try {
        const result = await chatService.addMessage(params)
        res.status(201).send(result)
    } catch (error) {
        switch (error.code) {
            case 'CHAT_NOT_EXIST':
                res.sendStatus(404)
                break
            case 'CHAT_IS_PROCESSING':
                res.status(409).send(errors.CHAT_IS_PROCESSING)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

const deleteChat = async (req, res) => {
    const chatId = Number(req.params.id)
    const { uid } = req.User
    try {
        await chatService.removeChat(chatId, uid)
        res.sendStatus(204)
    } catch (error) {
        switch (error.code) {
            case 'CHAT_NOT_EXIST':
                res.sendStatus(404)
                break
            default:
                console.log(error)
                res.sendStatus(500)
        }
    }
}

export { fetchChats, fetchMessages, createChat, createMessage, deleteChat }
