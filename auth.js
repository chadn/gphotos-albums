import {config} from './config.js';
import {Strategy as GoogleOAuthStrategy} from 'passport-google-oauth20';

export const auth = (passport) => {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  passport.use(new GoogleOAuthStrategy(
      {
        clientID: config.oAuthClientID,
        clientSecret: config.oAuthclientSecret,
        callbackURL: config.oAuthCallbackUrl
      },
      (token, refreshToken, profile, done) => done(null, {profile, token})));
};
