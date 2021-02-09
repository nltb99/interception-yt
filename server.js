require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//middleware
app.use(cors())
app.use(express.json())

const URI = 'mongodb+srv://youtubeblocker:youtubeblocker@cluster0.d8vf7.mongodb.net/<dbname>?retryWrites=true&w=majority'
mongoose.connect(URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


const subscribersRouter = require('./routes/subscribers')
app.use('/', subscribersRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Started'))
