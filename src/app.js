import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import initRoutes from './routes'

const app = express()

app.use(bodyParser.json())

initRoutes(app)

const port = process.env.PORT
app.listen(port, async () => {
    console.log(`Server is running at port ${port}.`)
})
