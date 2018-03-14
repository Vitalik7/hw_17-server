const express = require('express')

const Message = require('./model')

const router = express.Router()

router.get('/messages', (req, res, next) => {
  Message.find({})
        .sort('-createdAt')
        .limit(10)
        .then(messages => {
          res.json({messages})
        })
        .catch(next)
})

router.post('/messages', (req, res, next) => {
  new Message(req.body.message)
        .save()
        .then(message => {
          res.json({message})
        })
        .catch(next)
})

module.exports = router
