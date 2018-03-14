const host = 'localhost'

module.exports = {
  port: process.env.port || process.env.PORT || '3000',
  mongoUrl: process.env.MONGODB_URI || `mongodb://lavrenko_777:vitalik231@ds211289.mlab.com:11289/react-native-chat`,
  facebook: {
    clientID: '156122841758549',
    clientSecret: 'ff06acffc684562ab896a64af7bdb083',
    // callbackURL: 'http://192.168.1.109:3000/auth/facebook/callback',
    callbackURL: 'https://limitless-gorge-54663.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'name', 'displayName', 'picture', 'email']
  }
}
