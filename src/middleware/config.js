const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/userModel');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const initializePassport = () => {
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'test'
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.userId);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'User not found' });
      }
    } catch (error) {
      return done(error);
    }
  }));

  return passport.initialize();
};

const authenticateToken = () => {
  return (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err || !user) {
        const message = info && info.message ? info.message : 'Unauthorized';
        return res.status(401).json({ message });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = { initializePassport, authenticateToken };
