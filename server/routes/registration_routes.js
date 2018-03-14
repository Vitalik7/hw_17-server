const {SHA256} = require('crypto-js')
const {User} = require('../models/registration')

module.exports = function (app, mongoose) {
  app.get('/user/:id', (req, res) => {
    const id = req.params.id

    User.findById(id).then((user) => {
      if (!user) {
        return res.status(404).send()
      }
      res.send({user: user})
    }).catch((e) => {
      res.status(400).send(e)
    })
  })

  app.get('/users', (req, res) => {
    User.find().then((users) => {
      if (!users) {
        return res.status(404).send()
      }
      res.send({users})
    }).catch((e) => {
      res.status(400).send(e)
    })
  })

  app.post('/user', (req, res) => {
    let hashPassword = SHA256(req.body.password).toString()
    let newUser = new User({
      name: req.body.name,
      password: hashPassword,
      email: req.body.email
    })
    newUser.save().then(() => {
      return newUser.generateAuthToken()
    }).then((token) => {
      res.header('x-auth', token).send(newUser)
    }).catch((e) => {
      res.status(400).send(e)
    })
  })

  app.post('/user/login', (req, res) => {
    User.findOne({email: req.body.email}).then((user) => {
      if (!user) {
        return res.status(404).send()
      }
      if (user.password === SHA256(req.body.password).toString()) {
        let resUser = {
          name: user.name,
          id: user._id,
          email: user.email
        }
        res.send(resUser)
      } else {
        res.status(403).send()
      }
    }).catch((e) => {
      res.status(400).send(e)
    })
  })
}
