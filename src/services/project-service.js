import axios from 'axios'
import { literal, Op } from 'sequelize'

import db from '../models'
import * as storageService from './storage-service'

const axiosInstance = axios.create({
    baseURL: process.env.CHATBOT_DOMAIN,
})

async function getProjects(params) {
    // sort: year, views, and likes
    // search: title, year, author, hashtag
    const upperLimit = 25
    const { m, t, limit=upperLimit, offset=0, search, sort } = params
    let options = {
        attributes: { exclude: ['topicId', 'createdAt', 'updatedAt'] },
        include: [
            {
                model: db.Topic,
                attributes: ['id', 'name'],
                required: true,
            },
            {
                model: db.Hashtag,
                attributes: ['name'],
                through: { attributes: [] },
            }
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit: Math.min(limit, upperLimit),
        subQuery: false,
    }
    const countOptions = { distinct: true, where: {}, include: [] }
    if(t) {
        options.include[0].where = { id: t }
        countOptions.where.topicId = t
    }else if(m) {
        options.include[0].where = { majorId: m }
        countOptions.include.push({
            model: db.Topic,
            attributes: [],
            where: { majorId: m },
        })
    }
    if(sort) {
        const type = sort[0] == '+' ? 'ASC' : 'DESC'
        const field = sort.slice(1)
        options.order = [[field, type]]
    }
    if(search) {
        const year = Number(search)
        const hashtagPattern = /^#[^\s]*$/
        if(!isNaN(year)) {
            options.where = { year }
            countOptions.where.year = year
        }else if(hashtagPattern.test(search)) {
            const names = search.slice(1).split(',')
            const raw_query = literal(`(
                SELECT ph.project_id FROM project_hashtag AS ph 
                INNER JOIN hashtag AS h ON ph.hashtag_id = h.id
                WHERE h.name IN (?)
                GROUP BY ph.project_id
                HAVING COUNT(ph.project_id) = ?
            )`)
            const replacements = [names, names.length]
            options.where = { id: { [Op.in]: raw_query } }
            options.replacements = replacements
            countOptions.where.id = { [Op.in]: raw_query }
            countOptions.replacements = replacements
        }else {
            countOptions.include.push({
                model: db.Author,
                attributes: [],
            })
            countOptions.where[Op.or] = [
                literal(`MATCH(Project.title) AGAINST(:search)`),
                literal(`MATCH(authors.name) AGAINST(:search)`),
            ]
            countOptions.replacements = { search }
            if(sort) {
                options.include.push({
                    model: db.Author,
                    attributes: [],
                })
                options.where = {
                    [Op.or]: [
                        literal(`MATCH(Project.title) AGAINST(:search)`),
                        literal(`MATCH(authors.name) AGAINST(:search)`),
                    ]
                }
            }else {
                const projects = await db.Project.findAll({
                    ...countOptions,
                    attributes: [
                        'id',
                        literal(`SUM(DISTINCT(MATCH(Project.title) AGAINST(:search))) AS title_store`),
                        literal(`SUM(MATCH(authors.name) AGAINST(:search)) AS name_score`),
                    ],
                    group: 'Project.id',
                    order: [[literal('title_store + name_score'), 'DESC']],
                    offset: options.offset,
                    limit: options.limit,
                })
                const ids = projects.map(p => p.id)
                const temp = options
                options = {
                    attributes: temp.attributes,
                    include: [
                        {
                            model: db.Topic,
                            attributes: ['id', 'name'],
                            required: true,
                        },
                        {
                            model: db.Hashtag,
                            attributes: ['name'],
                            through: { attributes: [] },
                        }
                    ],
                    where: { id: ids },
                    order: [[literal('FIELD(Project.id, :ids)'), 'DESC']],
                    replacements: { ids },
                    subQuery: false,
                }
            }
        }
    }
    const totalItems = await db.Project.count(countOptions)
    console.log(totalItems)
    const metadata = { totalItems }
    const projects = await db.Project.findAll(options)
    const data = projects.map(p => {
        const topic = p.topic.dataValues
        const hashtags = p.hashtags.map(h => h.name)
        return {
            ...p.dataValues,
            topic,
            hashtags,
        }
    })
    return { data, metadata }
}

async function getProjectDetail(id) {
    const project = await db.Project.findByPk(id, {
        attributes: ['id', 'title', 'description', 'year', 'videoId', 'views', 'likes', 'createdAt'],
        include: [
            {
                model: db.Hashtag,
                attributes: ['name'],
                through: { attributes: [] },
            },
            {
                model: db.File,
                as: 'report',
                attributes: ['url'],
            },
            {
                model: db.Author,
                attributes: ['id', 'name', 'email'],
                include: {
                    model: db.File,
                    as: 'avatar',
                    attributes: ['url'],
                },
            },
            {
                model: db.Photo,
                attributes: ['id'],
                include: {
                    model: db.File,
                    attributes: ['url'],
                    required: true,
                }
            },
        ]
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const { hashtags, report, authors, photos, ...data } = project.get()
    data.hashtags = hashtags.map(h => h.name)
    data.reportUrl = report ? report.url : null
    data.authors = authors.map(a => {
        const { avatar, ...values } = a.get()
        values.avatarUrl = avatar ? avatar.url : null
        return values
    })
    data.photoUrls = photos.map(p => p.file.url)
    await project.update({ views: project.views+1 })
    return data
}

async function addProject(project, files) {
    const { hashtags, authors, ...newProject } = project
    const topic = await db.Topic.findByPk(newProject.topicId)
    if(!topic) {
        throw { code: 'TOPIC_NOT_EXIST' }
    }
    const authorEmails = authors.map(a => a.email)
    const count = await db.Author.count({
        where: { email: { [Op.or]: authorEmails } },
    })
    if(count) {
        throw { code: 'EMAIL_EXISTS' }
    }

    const { report, photos, avatars } = files
    const allFiles = []
    if(report) allFiles.push(...report)
    if(photos) allFiles.push(...photos)
    if(avatars) allFiles.push(...avatars)
    const transaction = await db.sequelize.transaction()
    try {
        const createPromises = []
        const project = await db.Project.create(newProject, { transaction })
        const existingHashtags = await db.Hashtag.findAll({
            where: { name: { [Op.or]: hashtags } },
        })
        const names = existingHashtags.map(h => h.name)
        const newHashtags = hashtags
                .filter(n => !names.includes(n))
                .map(name => ({ name }))
        const createdHashtags = await db.Hashtag
                .bulkCreate(newHashtags, { transaction })
        createPromises.push(
            project.addHashtags([...existingHashtags, ...createdHashtags], { 
                transaction,
            })
        )
        allFiles.forEach(f => f.ref = `projects/${project.id}/${f.filename}`)
        const fileUrls = await storageService.uploadFilesFromLocal(allFiles)
        const newFiles = allFiles.map((f, i) => ({
            url: fileUrls[i],
            name: f.filename,
            originalName: f.originalname,
            size: f.size,
            mimeType: f.mimetype,
            storageType: 'cloud',
        }))
        let index = 0
        if(report) {
            createPromises.push(
                project.createReport(newFiles[index++], { transaction })
            )
        }
        const newAuthors = authors.map(a => {
            const { fileIndex, ...values } = a
            values.projectId = project.id
            if(typeof fileIndex == 'number') {
                values.avatar = newFiles[fileIndex+index]
            }
            return values
        })
        createPromises.push(
            db.Author.bulkCreate(newAuthors, {
                include: ['avatar'],
                transaction,
            })
        )
        index += avatars ? avatars.length : 0
        if(photos) {
            const newPhotos = []
            while (index < newFiles.length) {
                newPhotos.push({
                    projectId: project.id,
                    file: newFiles[index++],
                })
            }
            createPromises.push(
                db.Photo.bulkCreate(newPhotos, {
                    include: ['file'],
                    transaction,
                })
            )
        }
        await Promise.all(createPromises)
        
        await transaction.commit()

        axiosInstance.post(`/projects/${project.id}`, { status: "created" })
        return project
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function updateProject(id, project) {
    const currentProject = await db.Project.findByPk(id)
    if(!currentProject) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const topic = await db.Topic.findByPk(project.topicId)
    if(!topic) {
        throw { code: 'TOPIC_NOT_EXIST' }
    }
    const { hashtags, ...values } = project
    const transaction = await db.sequelize.transaction()
    try {
        await currentProject.setHashtags([], { transaction })
        const currentHashtags = await db.Hashtag.findAll({
            where: { name: { [Op.or]: hashtags } },
            transaction,
        })
        const hashtagPromises = []
        if(currentHashtags.length) {
            hashtagPromises.push(
                currentProject.setHashtags(currentHashtags, { transaction })
            )
        }
        const names = currentHashtags.map(h => h.name)
        for (const h of hashtags) {
            if(!names.includes(h)) {
                hashtagPromises.push(
                    currentProject.createHashtag(h, { transaction })
                )
            }
        }
        await currentProject.update(values, { transaction })
        await Promise.all(hashtagPromises)

        await transaction.commit()
        axiosInstance.post(`/projects/${id}`, { status: "updated" })
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function updateReport(id, file) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        file.ref = `projects/${id}/${file.filename}`
        const fileUrl = await storageService.uploadFromLocal(file)
        const newReport = {
            url: fileUrl,
            name: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            storageType: 'cloud',
        }
        const oldReport = await project.getReport()
        await project.createReport(newReport, { transaction })
        if(oldReport) {
            const fileRef = `projects/${id}/${oldReport.name}`
            await storageService.deleteFile(fileRef)
            await oldReport.destroy({ transaction })
        }
        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function addAuthors(id, authors, files) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const authorCount = await project.countAuthors()
    if(authorCount + authors.length > 10) {
        throw { code: 'LIMIT_AUTHOR_COUNT' }
    }
    const emails = authors.map(a => a.email)
    const emailCount = await db.Author.count({
        where: { email: { [Op.or]: emails } },
    })
    if(emailCount) {
        throw { code: 'EMAIL_EXISTS' }
    }
    const filepaths = files.map(f => f.path)
    const fileUrls = await storageService.uploadFilesFromLocal(filepaths)
    const newFiles = files.map((f, i) => ({
        url: fileUrls[i],
        name: f.filename,
        originalName: f.originalname,
        size: f.size,
        mimeType: f.mimetype,
        storageType: 'cloud',
    }))
    const newAuthors = authors.map(a => {
        const {fileIndex, ...values} = a
        values.projectId = id
        if(typeof fileIndex == 'number') {
            values.avatar = newFiles[fileIndex]
        }
        return values
    })
    const results = await db.Author.bulkCreate(newAuthors, {
        include: ['avatar'], 
    })
    return results.map(r => {
        const { avatarId, createdAt, updatedAt, ...rest } = r.dataValues
        return rest
    })
}

async function addPhotos(id, files) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const filepaths = files.map(f => f.path)
    const fileUrls = await storageService.uploadFilesFromLocal(filepaths)
    const newFiles = files.map((f, i) => ({
        url: fileUrls[i],
        name: f.filename,
        originalName: f.originalname,
        size: f.size,
        mimeType: f.mimetype,
        storageType: 'cloud',
        photo: { projectId: id },
    }))
    const results = await db.File.bulkCreate(newFiles, {
        include: ['photo'],
    })
    return results.map(r => {
        const { photo, createdAt, ...rest } = r.dataValues
        return rest
    })
}

async function removePhoto(projectId, photoId) {
    const project = await db.Project.findByPk(projectId, {
        include: {
            model: db.Photo,
            where: { id: photoId }
        }
    })
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const photo = project.photos[0]
        const file = await photo.getFile()
        await storageService.deleteFile(file.name)
        await photo.destroy({ transaction })
        await file.destroy({ transaction })

        await transaction.commit()
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function removeProject(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const transaction = await db.sequelize.transaction()
    try {
        const fileIds = []
        const deletePromises = []
        const deletePromises2 = []
        // delete upstream folder
        deletePromises2.push(storageService.deleteFolder(`projects/${id}`))
        // delete project_hashtags
        deletePromises.push(project.setHashtags([], { transaction }))
        // delete authors
        const authors = await project.getAuthors({
            attributes: ['avatarId'],
            where: { avatarId: { [Op.ne]: null } },
            raw: true,
        })
        fileIds.push(authors.map(a => a.avatarId))
        deletePromises.push(
            db.Author.destroy({
                where: { projectId: id },
                transaction,
            })
        )
        // delete photos
        const photos = await project.getPhotos({
            attributes: ['fileId'],
            raw: true,
        })
        fileIds.push(photos.map(p => p.fileId))
        deletePromises.push(
            db.Photo.destroy({
                where: { projectId: id },
                transaction,
            })
        )
        await Promise.all(deletePromises)
        //delete project
        deletePromises2.push(project.destroy({ transaction }))
        // delete files
        deletePromises2.push(
            db.File.destroy({
                where: { id: { [Op.or]: fileIds } },
                transaction,
            })
        )
        await Promise.all(deletePromises2)
        // delete comment

        await transaction.commit()

        axiosInstance.post(`/projects/${id}`, { status: "deleted" })
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

async function addReaction(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    const values = { likes: project.likes + 1 }
    await project.update(values)
}

async function removeReaction(id) {
    const project = await db.Project.findByPk(id)
    if(!project) {
        throw { code: 'PROJECT_NOT_EXIST' }
    }
    if(!project.likes) {
        throw { code: 'BAD_REQUEST' }
    }
    const values = { likes: project.likes - 1 }
    await project.update(values)
}

export { getProjects, getProjectDetail, addProject, updateProject, updateReport, addAuthors, addPhotos, removePhoto, removeProject, addReaction, removeReaction }
