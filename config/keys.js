module.exports = {
  mongoURI: process.env.NODE_ENV === 'development' ? process.env.MONGODB_DEV_URI : process.env.MONGODB_PROD_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  secretOrKey: process.env.SECRET_OR_KEY,
  jwtExpiry: parseInt(process.env.JWT_EXPIRY),
}