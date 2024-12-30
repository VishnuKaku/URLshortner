// src/auth/google/strategy.ts
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import { User } from '../../models/User';
import authConfig from '../../config/auth.config';

passport.use(new GoogleStrategy({
    clientID: authConfig.google.clientId,
    clientSecret: authConfig.google.clientSecret,
    callbackURL: authConfig.google.callbackUrl
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0]?.value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;