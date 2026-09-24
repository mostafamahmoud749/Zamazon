import passport from 'passport';
import { Strategy, type Profile } from 'passport-github';
import type { VerifyCallback } from 'passport-oauth2';
import { GithubUser } from '../mongoose/schemas/githubUsers.js';

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required');
}

export default passport.use(
  new Strategy(
    {
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:9000/api/auth/github/callback',
      scope: ['identify'],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) {
      let findUser;

      try {
        findUser = await GithubUser.findOne({ githubID: profile.id });
      } catch (err) {
        return done(err);
      }

      try {
        if (!findUser) {
          const newUser = new GithubUser({ userName: profile.username, githubID: profile.id });
          const savedUser = await newUser.save();

          return done(null, savedUser);
        }
        return done(null, findUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
