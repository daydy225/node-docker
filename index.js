const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const redis = require('redis')
const cors = require('cors')
let RedisStore = require('connect-redis')(session)

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require('./config/config')

let redisClient = redis.createClient({
  legacyMode: true,
  socket: {
    host: REDIS_URL,
    port: REDIS_PORT,
  },
})

redisClient.connect().catch(console.error)

const postRouter = require('./routes/postRoutes')
const authRouter = require('./routes/authRoutes')
const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log('Successfully connected to DB'))
    .catch(error => {
      console.log(error)
      setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()

app.enable('trust proxy')
app.use(cors({}))
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
)

app.use(express.json())

app.get('/api/v1', (req, res) => {
  res.send('<h2>Hello Docker with Daydy 2022 !!!</h2>')
  console.log('yeah nginx is working')
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', authRouter)

const port = process.env.PORT || 3000

app.listen(port, console.log(`listening on port ${port}`))
