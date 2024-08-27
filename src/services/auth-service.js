import bcrypt from 'bcrypt'

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash)
}

export { checkPassword }
