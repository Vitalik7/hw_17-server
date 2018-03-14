const express = require('express')
const bodyParser = require('body-parser')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const MessageModel = require('./chat/model')
const message = require('./chat/chat')

const config = require('./config')
const user = require('./registration/registration')

const app = express()


require('./db')
require('./auth')

app.listen(config.port, () => {
  console.log(`Server running at port: ${config.port}`)
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('chat message', function (msg) {
    console.log('incoming msg: ' + JSON.stringify(msg))
    new MessageModel(msg)
          .save()
        .then(message => {
          io.emit('chat message', message)
        })
  })

  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

app.use(bodyParser.json())

app.use('/api/v1', user)

// error handling
app.use((req, res, next) => {
  const err = new Error(`Not Found ${req.path}`)
  err.status = 404
  next(err)
})
app.use((error, req, res, next) => {
  if (error) {
    console.log(error)
    return res.status(400).json({error})
  }
  next(error)
})
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
