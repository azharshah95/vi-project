const mongoose = require('mongoose');
const Schema = mongoose.Schema

// Create Schema
const UrlSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    auto: true,   // generating auto objectId for public users (although it can be fixed by converting public sessions, i.e: users creating account later on)
    ref: 'Users'
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  urlCode: {
    type: String,
    required: true
  },
  hits: {   // number hits on shortUrl
    type: Number,
    default: 0,
    // required: true
  },
  requests: {   // number of hits on how requests were made to shorten the same url
    type: Number,
    default: 0,
    // required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Url = mongoose.model('urls', UrlSchema)