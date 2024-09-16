import db from '../models'

async function getTopicsByMajor(majorId, options) {
    const major = await db.Major.findByPk(majorId)
    if(!major) {
        throw { code: 'MAJOR_NOT_EXIST' }
    }
    const upperLimit = 25
    const {
        limit = upperLimit,
        offset = 0,
    } = options
    const totalItems = await major.countTopics()
    const metadata = { totalItems }
    if(limit === 0) {
        return { data: [], metadata }
    }
    const majors = await major.getTopics({
        attributes: { exclude: ['createdAt', 'updatedAt', 'majorId'] },
        raw: true,
        order: [['name', 'ASC']],
        offset,
        limit: Math.min(limit, upperLimit),
    })
    return { data: majors, metadata }
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

async function addTopic(topic) {
    const created = await db.Topic.create(topic)
    const { createdAt, updatedAt, ...rest } = created.dataValues
    return rest
}

async function updateTopic(id, topic) {
    const result = await db.Topic.update(
        { name: topic.name }, 
        { where: { id } }
    )
    return !!result[0]
}

async function removeTopic(id) {
    const amount = await db.Project.count({ where: { topicId: id } })
    if(amount > 0) {
        return false
    }
    const affected = await db.Topic.destroy({
        where: { id },
    })
    return !!affected
}

export { getTopicsByMajor, getTopicByName, getTopicById, addTopic, updateTopic, removeTopic }
