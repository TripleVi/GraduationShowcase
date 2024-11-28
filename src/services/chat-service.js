import axios from 'axios'

import db from '../models'
import redis from '../config/redis'

function axiosChatbot() {
    return axios.create({
        baseURL: process.env.CHATBOT_DOMAIN,
        responseType: 'stream',
    })
}

async function isProcessing(userId, chatId) {
    const db = await redis.instance
    const value = await db.get(`${userId}#chat${chatId}`)
    return value === 'true'
}

async function startProcessing(userId, chatId) {
    const db = await redis.instance
    await db.set(`${userId}#chat${chatId}`, 'true')
}

async function finishProcessing(userId, chatId) {
    const db = await redis.instance
    await db.del(`${userId}#chat${chatId}`)
}

async function getChats(userId, params) {
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = params
    const options = {
        attributes: ['id', 'title', 'createdAt'],
        where: { userId },
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
    }
    const { count, rows } = await db.Chat.findAndCountAll(options)
    return {
        data: rows,
        metadata: {
            totalItems: count,
        },
    }
}

async function getMessages(chatId, userId, params) {
    const chat = await db.Chat.findOne({
        attributes: ['id'],
        where: { id: chatId, userId },
    })
    if(!chat) {
        throw { code: 'CHAT_NOT_EXIST' }
    }
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = params
    const options = {
        attributes: ['id', 'content', 'sender', 'createdAt'],
        where: { chatId },
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
    }
    const { count, rows } = await db.Message.findAndCountAll(options)
    return {
        data: rows,
        metadata: {
            totalItems: count,
        },
    }
}

async function addChat(data) {
    return axiosChatbot().post('/chats', data)
}

async function addMessage(params) {
    const { userId, chatId, data } = params
    const chat = await db.Chat.findOne({
        attributes: ['id'],
        where: { id: chatId, userId },
    })
    if(!chat) {
        throw { code: 'CHAT_NOT_EXIST' }
    }

    const flag = await isProcessing(userId, chatId)
    if(flag) {
        throw { code: 'CHAT_IS_PROCESSING' }
    }
    await startProcessing(userId, chatId)

    const url = `/chats/${chatId}/messages`
    return axiosChatbot().post(url, data)
}

async function removeChat(id, userId) {
    const chat = await db.Chat.findOne({
        attributes: ['id'],
        where: { id, userId },
    })
    if(!chat) {
        throw { code: 'CHAT_NOT_EXIST' }
    }
    await db.Message.destroy({
        where: { chatId: chat.id },
    })
    await chat.destroy()
}

export { getChats, getMessages, addChat, addMessage, removeChat, finishProcessing }
