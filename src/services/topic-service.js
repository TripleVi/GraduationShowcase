import db from '../models'

async function getTopics(params) {
    const upperLimit = 25
    const { m, limit = upperLimit, offset = 0 } = params
    if(limit === 0) {
        return { data: [] }
    }
    const options = {
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
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

export { getTopics, getTopicByName, getTopicById, addTopic, updateTopic, removeTopic }
