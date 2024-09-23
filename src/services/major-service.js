import db from '../models'

async function getMajors(params) {
    const upperLimit = 25
    const { limit = upperLimit, offset = 0 } = params
    const totalItems = await db.Major.count()
    const metadata = { totalItems }
    if(!limit || !totalItems) {
        return { data: [], metadata }
    }
    const majors = await db.Major.findAll({
        attributes: ['id', 'name'],
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
    })
    return { data: majors, metadata }
}

async function addMajor(major) {
    const count = await db.Major.count({ 
        where: { name: major.name },
    })
    if(count) {
        throw { code: 'MAJOR_EXISTS' }
    }
    return db.Major.create(major)
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
