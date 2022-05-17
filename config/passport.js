const { Strategy, ExtractJwt } = require('passport-jwt') 
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

module.exports = passport => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.log(err));
    })
  )
}
