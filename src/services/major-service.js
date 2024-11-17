import axios from 'axios'

import db from '../models'

const axiosInstance = axios.create({
    baseURL: process.env.CHATBOT_DOMAIN,
})

async function getMajors(params) {
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = params
    const options = {
        attributes: ['id', 'name'],
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
    }
    const { count, rows } = await db.Major.findAndCountAll(options)
    return {
        data: rows,
        metadata: {
            totalItems: count,
        },
    }
}

async function addMajor(major) {
    const count = await db.Major.count({
        where: { name: major.name },
    })
    if(count) {
        throw { code: 'MAJOR_EXISTS' }
    }
    const result = await db.Major.create(major)
    axiosInstance.post(`/majors/${result.id}`, { status: "created" })
    return result
}

async function updateMajor(major) {
    const currentMajor = await db.Major.findByPk(major.id)
    if(!currentMajor) {
        throw { code: 'MAJOR_NOT_EXIST' }
    }
    const existingMajor = await db.Major.findOne({
        attributes: ['id'],
        where: { name: major.name },
    })
    if(!existingMajor) {
        await currentMajor.update(major)
    }else if(existingMajor.id !== major.id) {
        throw { code: 'MAJOR_EXISTS' }
    }
}

async function removeMajor(id) {
    const major = await db.Major.findByPk(id)
    if(!major) {
        throw { code: 'MAJOR_NOT_EXIST' }
    }
    const topicCount = await major.countTopics()
    if(topicCount) {
        throw { code: 'MAJOR_HAS_TOPICS' }
    }
    await major.destroy()
}

export { getMajors, addMajor, updateMajor, removeMajor }
