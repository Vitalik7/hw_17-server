const usersRoutes = require('./registration_routes')
const messageRoutes = require('./chat_routes')

module.exports = function(app, db) {
  usersRoutes(app, db)
  messageRoutes(app, db)
}
