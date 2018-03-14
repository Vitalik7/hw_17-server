const {Message} = require('../models/chat')

module.exports = function (websocket) {
  websocket.on('connection', (socket) => {
    console.log('A client just joined on', socket.id)
    socket.on('message', (message) => {
      let newMessage = new Message({
        text: message.text,
        user: message.user,
        createAt: message.createAt
      })
      newMessage.save().then(() => {
        socket.broadcast.emit('message', message)
      })
    })
  })
}
