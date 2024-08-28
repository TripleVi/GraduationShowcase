import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import initRoutes from './routes'

const app = express()

app.use(bodyParser.json())

initRoutes(app)

const port = process.env.PORT || 3000
app.listen(port, async () => {
    console.log(`Server is running at port ${port}.`)
})
