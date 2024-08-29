export const INVALID_CREDENTIAL = Object.freeze({
    code: 'invalid-credential',
    message: 'Username or password is not correct!'
})

export const MAJOR_EXISTS = Object.freeze({
    code: 'major-exists',
    message: 'Major already exists!'
})

export const MAJOR_NOT_EXIST = Object.freeze({
    code: 'major-not-exist',
    message: 'Major does not exist!'
})

export const TOPIC_EXISTS = Object.freeze({
    code: 'topic-exists',
    message: 'Topic already exists!'
})

export const MAJOR_HAS_TOPICS = Object.freeze({
    code: 'major-has-topics',
    message: 'Major contains topics!'
})

export const TOPIC_HAS_PROJECTS = Object.freeze({
    code: 'topic-has-projects',
    message: 'Topic contains projects!'
})
