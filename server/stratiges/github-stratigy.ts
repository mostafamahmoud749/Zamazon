import passport from 'passport';
import { Strategy, type Profile } from 'passport-github';
import type { VerifyCallback } from 'passport-oauth2';
import { prisma } from '@/prisma/lib/prisma.js';

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
        const githubID = Number(profile.id);
        findUser = await prisma.githubUser.findUnique({ where: { githubID } });
      } catch (err) {
        return done(err);
      }

      try {
        if (!findUser) {
          const userName = profile.username ?? profile.displayName ?? `github-${profile.id}`;
          const newUser = await prisma.githubUser.create({
            data: {
              id: Number(profile.id),
              githubID: Number(profile.id),
              userName,
            },
          });

          return done(null, {
            id: newUser.githubID,
            githubID: newUser.githubID,
            userName: newUser.userName,
          });
        }
        return done(null, {
          id: findUser.githubID,
          githubID: findUser.githubID,
          userName: findUser.userName,
        });
      } catch (err) {
        return done(err);
      }
    },
  ),
);
