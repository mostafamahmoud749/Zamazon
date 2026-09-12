import passport from 'passport';
import { Strategy } from 'passport-github';
import { GithubUser } from '../mongoose/schemas/githubUsers.mjs';

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:9000/api/auth/github/callback',
      scope: ['identify'],
    },
    async function (accessToken, refreshToken, profile, done) {
      let findUser;

      try {
        findUser = await GithubUser.findOne({ githubID: profile.id });
      } catch (err) {
        done(err, null);
      }

      try {
        if (!findUser) {
          const newUser = new GithubUser({ userName: profile.username, githubID: profile.id });
          const savedUser = await newUser.save();

          return done(null, savedUser);
        }
        return done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
