const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    mongoose = require('mongoose'),
    config = require('./keys'),
    User = mongoose.model('users');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (payload, done) => {

            console.log(`Payload: ${JSON.stringify(payload)}`);

            User.findById(payload.id)
            .then((user) => {
                if(user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => console.log(`Error in passport middleware for user ${user}: ${err}`));
    })
    );
};