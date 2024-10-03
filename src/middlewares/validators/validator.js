function validateId(id) {
    const pattern = /^\d+$/
    if(pattern.test(id.trim())) {
        return [true, parseInt(id)]
    }
    return [false, id]
}

export { validateId }
