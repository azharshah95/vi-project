const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const dotenv = require('dotenv').config()

// DB Config
const db = require('./config/keys')

// App
const app = express()

// Cors
app.use(cors())
app.options('*', cors())

// Routes Imports
const urls = require('./routes/api/url')
const index = require('./routes/api/index')
const users = require('./routes/api/users')


// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes path
app.use('/api/users', users)
app.use('/api/url', urls)
app.use('/api', index)

// Connect to mongodb
mongoose
  .connect(db.mongoURI, db.options)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

// Test Routes
app.get('/', (req, res) => {
  console.log('Hello');
  res.send('hello')
})
  
// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

// Port
const port = process.env.PORT || 5000

// Listening
app.listen(port, () => console.log(`Server running on port ${port}` ))
