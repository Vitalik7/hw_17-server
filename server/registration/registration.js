const express = require('express')

const User = require('/model')

const router = express.Router()

router.get('/user/:id', (req, res) => {
  User.findById({'_id': req.params.id}, (err, user) => {
    if (err) {
      res.status(400).json(err)
    }
    res.status(200).json(user)
  })
})

router.get('/user', (req, res, next) => {
  User.find({})
    .then(user => {
      res.json({user})
    })
    .catch(next)
})

router.post('/user', (req, res) => {
  let newUser = new User(req.body.user)
  if (req.body.user.email !== '' && req.body.user.password !== '' && req.body.user.username !== '') {
    newUser.save()
      .then(user => {
        res.json({user})
      }, (err) => {
        res.status(400).json(err)
      })
  } else {
    console.log('user err , field is empty : ', req.body.user)
    res.status(400).json({success: false, message: 'Please fill in the fields'})
  }
})

router.put('/user/:id', function (req, res) {
  let user = req.body.user
  if (('email' in user) && ('password' in user) && ('username' in user)) {
    User.findOneAndUpdate({'_id': req.params.id},
      {email: req.body.user.email,
        password: req.body.user.password,
        username: req.body.user.username
      },
      {new: true},
      function (err, user) {
        if (err) {
          res.status(400).json(err)
        }
        res.status(200).json(user)
      })
  } else {
    res.status(400).json({success: false, message: 'unacceptable changes'})
  }
})

router.delete('/user/:id', function (req, res) {
  let id = req.params.id
  User.remove({
    _id: id
  }, function () {
    res.json()
  })
})

module.exports = router
