const mongoose = require('mongoose')

let MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  createAt: {
    type: String,
    required: true
  }
})

let Message = mongoose.model('Message', MessageSchema)

module.exports = {Message: Message}
