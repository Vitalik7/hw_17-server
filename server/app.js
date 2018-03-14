const http = require('http').Server(app)
const bodyParser = require('body-parser')
const io = require('socket.io')(http)
const MessageModel = require('./message/model')
const message = require('./message/message')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
const facebook = config.facebook

const config = require('./config')
const user = require('./registration/registration')

const app = require('express')()

require('./db')

http.listen(config.port, () => {
  console.log(`Server running at port: ${config.port}`)
})

const transformFacebookProfile = (profile) => ({
  name: profile.name,
  avatar: profile.picture.data.url
})

passport.use(new FacebookStrategy(facebook,
    // Gets called when user authorizes access to their profile
    async function (accessToken, refreshToken, profile, done) {
      done(null, transformFacebookProfile(profile._json))
    }
))

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user))

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user))

app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use('/api', message)
app.use('/api', user)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
    // Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
    (req, res) => {
      res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user))
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
