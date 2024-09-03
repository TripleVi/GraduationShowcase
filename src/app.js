import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

import initRoutes from './routes'
import serviceAccount from '../service-account-key.json'

const app = express()

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

app.use(bodyParser.json())

initRoutes(app)

const bucket = getStorage().bucket()

const port = process.env.PORT || 3000
app.listen(port, async () => {
    console.log(`Server is running at port ${port}.`)
})
