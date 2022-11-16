const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new TwitterStrategy(
    {
      consumerKey: "FRyfhUGoTDzgqsaKOwleHTIUd",
      consumerSecret: "PhXE6vy5A9nu3S0u4WslU9kLEBaJv84bYvHHm6UOwek0m7kYwo",
      callbackURL: "http://localhost:3000/auth/twitter/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
