var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//   },
//   function(username, password, done) {
//     User.findOne({ email: username }, function (err, user) {
//       if (err) { return done(err); }
//       // Return if user not found in database
//       if (!user) {
//         return done(null, false, {
//           message: 'User not found'
//         });
//       }
//       console.log("user passport", user);
//       // Return if password is wrong
//       if (!user.validPassword(password)) {
//         return done(null, false, {
//           message: 'Password is wrong'
//         });
//       }
//       // If credentials are correct, return the user object
//       return done(null, user);
//     });
//   }
// ));