import db from '../models'

async function getMajors(options) {
    const upperLimit = 25
    const {
        limit = upperLimit,
        offset = 0,
    } = options
    const totalItems = await db.Major.count()
    const metadata = { totalItems }
    if(limit === 0) {
        return { data: [], metadata }
    }
    const majors = await db.Major.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        order: [['name', 'ASC']],
        offset,
        limit: Math.min(limit, upperLimit),
    })
    return { data: majors, metadata }
}

async function getMajorByName(name) {
    return db.Major.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        where: { name }
    })
}

async function getMajorById(id) {
    return db.Major.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
    })
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

export { getMajors, getMajorByName, getMajorById, addMajor, updateMajor, removeMajor }
