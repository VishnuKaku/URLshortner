// Google strategy implementation 
// src/auth/google/strategy.ts
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import passport from 'passport';
import { User } from '../../models/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            email: profile.emails?.[0].value,
            googleId: profile.id,
            isVerified: true
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;