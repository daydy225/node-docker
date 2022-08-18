const moogoose = require('mongoose')

const userSchema = moogoose.Schema({
  username: {
    type: String,
    required: [true, 'User must have a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
  },
})

const User = moogoose.model('User', userSchema)

module.exports = User
