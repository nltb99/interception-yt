require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

let uri='mongodb+srv://youtubeblocker:youtubeblocker@cluster0.d8vf7.mongodb.net/youtube?retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

app.listen(3000, () => console.log('Server Started'))
