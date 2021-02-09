require('dotenv').config()

const express = require('express'),
 app = express(),
 cors = require('cors'),
 mongoose = require('mongoose')

//middleware
app.use(cors())
app.use(express.json())

// mongoose
const URI = 'mongodb+srv://youtubeblocker:youtubeblocker@cluster0.d8vf7.mongodb.net/<dbname>?retryWrites=true&w=majority'
const db = mongoose.connection

mongoose.connect(URI, { useNewUrlParser: true })
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const channels = require('./routes/channels')
app.use('/api', channels)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Started'))
