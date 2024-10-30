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
    console.log('hello world')
    res.sendStatus(204)
}

const createMessage = async (req, res) => {
    
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
