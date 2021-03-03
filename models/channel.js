const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: false,
  },
  channelId: {
    type: String,
    required: true,
  },
  idEx: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Subscriber',channelSchema)