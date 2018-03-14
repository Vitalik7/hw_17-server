const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const bodyParser = require('body-parser')

const routes = require('./routes/index')
const sockets = require('./sockets/index')
const {mongoose} = require('./db/mongoose')

const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
const GoogleStrategy = require('passport-google-oauth20')
const facebook = require('/config')

const transformFacebookProfile = (profile) => ({
  name: profile.name,
  avatar: profile.picture.data.url
})

passport.use(new FacebookStrategy(facebook, async (accessToken, refreshToken, profile, done) => {
    done(null, transformFacebookProfile(profile._json))
  }
))

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) => done(null, user))

const app = express()

app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json())
const server = http.Server(app)
const websocket = socketio(server, {
  pingTimeout: 30000,
  pingInterval: 30000
})
const port = process.env.PORT || process.env.port || 8000


routes(app, mongoose)

app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)))


server.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

sockets(websocket)

module.exports = {app}
