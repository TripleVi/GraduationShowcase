import db from '../models'

export async function getMajors(options) {
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

export async function getMajorByName(name) {
    return db.Major.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        where: { name }
    })
}

export async function getMajorById(id) {
    return db.Major.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
    })
}

export async function addMajor(major) {
    const created = await db.Major.create(major)
    const { createdAt, updatedAt, ...rest } = created.dataValues
    return rest
}

export async function updateMajor(id, major) {
    const result = await db.Major.update(major, {
        where: { id },
    })
    return !!result[0]
}

export async function removeMajor(id) {
    const amount = await db.Topic.count({ where: { majorId: id } })
    if(amount > 0) {
        return false
    }
    const affected = await db.Major.destroy({
        where: { id },
    })
    return !!affected
}
