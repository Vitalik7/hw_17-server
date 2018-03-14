const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: Date
})

module.exports = mongoose.model('Message', messageSchema)
