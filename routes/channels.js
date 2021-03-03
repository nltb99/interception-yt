const express = require('express')
const router = express.Router()
const Channel = require('../models/channel')
const jwt = require('jsonwebtoken')
const {authVerifyToken} = require('./helper');

router.get('/channels',async (req,res) => {
  try {
    const channels = await Channel.find()
    return res.status(200).json(channels)
  } catch(err) {
    return res.status(404).json({message: err.message})
  }
})

router.get('/filterchannel/:idEx',authVerifyToken,async (req,res) => {
  try {
    const channels = await Channel.find({idEx: req.params.idEx})
    return res.status(200).json(channels)
  } catch(err) {
    return res.status(400).json({message: err.message})
  }
})

router.post('/insert',async (req,res) => {
  try {
    const channel = new Channel({
      channelName: req.body.channelName,
      alias: req.body.alias,
      channelId: req.body.channelId,
      idEx: req.body.idEx,
    })
    const newChannel = await channel.save()
    return res.status(201).json(newChannel)
  } catch(err) {
    return res.status(400).json({message: err.message})
  }
})

router.get('/deleteByExtension/:idEx',(req,res) => {
  try {
    Channel.deleteMany({idEx: req.params.idEx}).then(() => {
      return res.status(200).json({message: "Delete Successful"})
    }).catch((e) => {
      return res.status(404).json({message: e})
    })
  } catch(err) {
    return res.status(400).json({message: err.message})
  }
})

router.post('/deleteByChannel',(req,res) => {
  try {
    Channel.deleteOne({_id: req.body._id}).then(() => {
      return res.status(200).json({message: "Delete Successful"})
    }).catch((e) => {
      return res.status(404).json({message: e})
    })
  } catch(err) {
    return res.status(400).json({message: err.message})
  }
})

router.get('/login/:idEx',(req,res) => {
  try {
    jwt.sign(
      {idEx: req.params.idEx},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: 60 * 60 * 24 * 3},
      (err,token) => {
        if(err) throw err;
        const obj = {token: token};
        return res.status(200).json(obj);
      },
    );
  } catch(err) {
    return res.status(403).json({message: err.message})
  }
});

module.exports = router