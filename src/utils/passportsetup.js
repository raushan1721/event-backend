var GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;

const passport = require("passport");
const User = require("../model/user");
const jwtSign = require("../utils/jwt-sign");

const googleSecrets = JSON.parse(process.env.GOOGLE_SECRET);

const GOOGLE_CLIENT_ID = googleSecrets.client_id;
const GOOGLE_CLIENT_SECRET = googleSecrets.client_secret;

// FACEBOOK_APP_ID = "your id";
// FACEBOOK_APP_SECRET = "your id";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:2000/socialauth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const gProfile = profile._json;

      done(null, profile);
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
