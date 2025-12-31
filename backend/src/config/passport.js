import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const upsertSocialUser = async ({ email, name }) => {
  if (!email) {
    return null;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return existing;
  }
  const hashed = await bcrypt.hash(`${email}-${Date.now()}`, 10);
  return prisma.user.create({
    data: {
      name: name || "Social User",
      email,
      password: hashed,
      role: "CUSTOMER"
    }
  });
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertSocialUser({
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName", "emails"]
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertSocialUser({
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/twitter/callback`,
        includeEmail: true
      },
      async (_token, _tokenSecret, profile, done) => {
        try {
          const user = await upsertSocialUser({
            email: profile.emails?.[0]?.value,
            name: profile.displayName
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
