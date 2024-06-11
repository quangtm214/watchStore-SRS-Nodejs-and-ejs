const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const Member = require("./model/memberModel");
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "membername" },
      (membername, password, done) => {
        Member.findOne({ membername: membername })
          .then((member) => {
            if (!member) {
              return done(null, false, { message: "This name is false" });
            }

            bcrypt.compare(password, member.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, member);
              } else {
                return done(null, false, { message: "password is incorect" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  passport.serializeUser(function (member, done) {
    process.nextTick(function () {
      done(null, member.id);
    });
  });
  passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
      return done(null, user);
    });
  });
};
