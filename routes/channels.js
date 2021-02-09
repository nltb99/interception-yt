const express = require('express')
const router = express.Router()
const Channel = require('../models/channel')

router.get('/',async (req,res) => {
  try {
    const channels = await Channel.find()
    res.json(channels)
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

router.post('/',async (req,res) => {
  try {
    const channel = new Channel({
      name: req.body.name,
      subscribedToChannel: req.body.subscribedToChannel
    })
    const newChannel = await channel.save()
    res.status(201).json(newChannel)
  } catch(err) {
    res.status(400).json({message: err.message})
  }
})

router.delete('/:id',getChannel,async (req,res) => {
  try {
    await res.channel.remove()
    res.json({message: 'Deleted channel'})
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

async function getChannel(req,res,next) {
  let channel = null
  try {
    channel = await Channel.findById(req.params.id)
    if(channel == null) {
      return res.status(404).json({message: 'Cannot find channel'})
    }
  } catch(err) {
    return res.status(500).json({message: err.message})
  }
  res.channel = channel
  next()
}

module.exports = router