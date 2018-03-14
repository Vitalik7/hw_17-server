const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()

  return {
    id: userObject._id,
    email: userObject.email,
    name: userObject.name
  }
}

UserSchema.methods.generateAuthToken = function () {
  let user = this
  let access = 'auth'
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'secret').toString()

  user.tokens.push({access, token})

  return user.save().then(() => {
    return token
  })
}

let User = mongoose.model('User', UserSchema)

module.exports = {User: User}
