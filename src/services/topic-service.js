import db from '../models'

async function getTopics(params) {
    const upperLimit = 25
    const { m, limit = upperLimit, offset = 0 } = params
    const options = {
        attributes: ['id', 'name'],
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
    }
    if(m) {
        options.where = { majorId: m }
    }
    const { count, rows } = await db.Topic.findAndCountAll(options)
    return {
        data: rows,
        metadata: {
            totalItems: count,
        },
    }
}

async function getTopicByName(name) {
    return db.Topic.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        where: { name }
    })
}

async function getTopicById(id) {
    return db.Topic.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
    })
}

async function addTopic(majorId, topic) {
    const major = await db.Major.findByPk(majorId)
    if(!major) {
        throw { code: 'MAJOR_NOT_EXIST' }
    }
    const topicCount = await db.Topic.count({
        where: { name: topic.name },
    })
    if(topicCount) {
        throw { code: 'TOPIC_EXISTS' }
    }
    return major.createTopic(topic)
}

async function updateTopic(topic) {
    const { id, ...values } = topic
    const currentTopic = await db.Topic.findByPk(id, {
        attributes: ['id'],
    })
    if(!currentTopic) {
        throw { code: 'TOPIC_NOT_EXIST' }
    }
    const existingTopic = await db.Topic.findOne({
        attributes: ['id'],
        where: { name: topic.name },
    })
    if(!existingTopic) {
        await currentTopic.update(values)
    }else if(existingTopic.id !== id) {
        throw { code: 'TOPIC_EXISTS' }
    }
}

async function removeTopic(id) {
    const topic = await db.Topic.findByPk(id, {
        attributes: ['id'],
    })
    if(!topic) {
        throw { code: 'TOPIC_NOT_EXIST' }
    }
    const projectCount = await topic.countProjects()
    if(projectCount) {
        throw { code: 'TOPIC_HAS_PROJECTS' }
    }
    await topic.destroy()
}

export { getTopics, getTopicByName, getTopicById, addTopic, updateTopic, removeTopic }
