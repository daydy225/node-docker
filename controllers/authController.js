const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

const signUp = async (req, res) => {
  const { username, password } = req.body
  try {
    const hashpassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      username,
      password: hashpassword,
    })
    req.session.user = newUser
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    })
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'user not found',
      })
    }

    const isCorrect = await bcrypt.compare(password, user.password)

    if (isCorrect) {
      req.session.user = user
      res.status(200).json({
        status: 'success',
      })
    } else {
      res.status(400).json({
        status: 'failed',
        message: 'incorrect username or password',
      })
    }
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

module.exports = {
  signUp,
  login,
}
