import { getAuth } from 'firebase-admin/auth'

const verifyToken = async (req, res) => {
    const decodedToken = await getAuth().verifyIdToken()
    console.log(decodedToken)
}

export { verifyToken }
