const {Message} = require('../models/chat')

module.exports = function (app, mongoose) {
  app.get('/message', (req, res) => {
    Message.find().then((message) => {
      if (!message) {
        return res.status(404).send()
      }
      res.send({message})
    }).catch((e) => {
      res.status(400).send(e)
    })
  })
}
