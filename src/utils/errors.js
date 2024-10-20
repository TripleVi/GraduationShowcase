export const INVALID_TOKEN = Object.freeze({
    code: 'INVALID_TOKEN',
    message: 'Token is not valid!'
})

export const TOKEN_EXPIRED = Object.freeze({
    code: 'TOKEN_EXPIRED',
    message: 'Token expired!'
})

export const INVALID_CREDENTIAL = Object.freeze({
    code: 'INVALID_CREDENTIAL',
    message: 'User credential is not valid!'
})

export const EMAIL_EXISTS = Object.freeze({
    code: 'EMAIL_EXISTS',
    message: 'Email already exists!'
})

export const MAJOR_EXISTS = Object.freeze({
    code: 'MAJOR_EXISTS',
    message: 'Major already exists!'
})

export const MAJOR_NOT_EXIST = Object.freeze({
    code: 'MAJOR_NOT_EXIST',
    message: 'Major does not exist!'
})

export const TOPIC_EXISTS = Object.freeze({
    code: 'TOPIC_EXISTS',
    message: 'Topic already exists!'
})

export const TOPIC_NOT_EXIST = Object.freeze({
    code: 'TOPIC_NOT_EXIST',
    message: 'Topic does not exist!'
})

export const MAJOR_HAS_TOPICS = Object.freeze({
    code: 'MAJOR_HAS_TOPICS',
    message: 'Major contains topics!'
})

export const TOPIC_HAS_PROJECTS = Object.freeze({
    code: 'TOPIC_HAS_PROJECTS',
    message: 'Topic contains projects!'
})

export const PROJECT_NOT_EXIST = Object.freeze({
    code: 'PROJECT_NOT_EXIST',
    message: 'Project does not exist!'
})

export const COMMENT_NOT_EXIST = Object.freeze({
    code: 'COMMENT_NOT_EXIST',
    message: 'Comment does not exist!'
})

export const USER_NOT_EXIST = Object.freeze({
    code: 'USER_NOT_EXIST',
    message: 'User does not exist!'
})

export const COMMENT_PUT_FORBIDDEN = Object.freeze({
    code: 'ACTION_FORBIDDEN',
    message: 'Only the creator can update this comment!'
})

export const COMMENT_DEL_FORBIDDEN = Object.freeze({
    code: 'ACTION_FORBIDDEN',
    message: 'Only the creator can delete this comment!'
})
