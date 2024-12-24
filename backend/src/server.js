import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { port, mongodb_uri } from './config.js'
import router from './router.js'
import logger from './utils/logger.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

mongoose
    .connect(mongodb_uri)
    .then(() => {
        logger.info('Connected to the database')

        app.listen(port, () => {
            logger.info(`Server running on http://localhost:${port}`)
        })
    })
    .catch((err) => {
        logger.error(`Failed to connect to the database: ${err}`)
    })
