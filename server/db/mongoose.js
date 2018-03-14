const mongoose = require('mongoose')
const db = require('./config')

mongoose.Promise = global.Promise
mongoose.connect(db.url)

module.exports = {mongoose}