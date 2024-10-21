import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import { initializeApp, cert } from 'firebase-admin/app'

import initRoutes from './routes'
import serviceAccount from '../service-account-key.json'
import { initCronJobs } from './cronjobs'
import { maintenance } from './services/maintenance'

const app = express()

app.use(cors({
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200,
  credentials: true,
}))

maintenance(app)

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
})

app.use(bodyParser.json())

initRoutes(app)

initCronJobs()

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log(`Server is running at port ${port}.`)
})
