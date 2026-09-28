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
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: profile.provider,
            providerAccountId: profile.id,
          },
        },
        include: {
          user: true,
        },
      });

      if (account) {
        return done(null, account.user);
      }

      const newUser = await prisma.user.create({
        data: {
          email: profile.emails?.[0]?.value || null,
          name: profile.displayName || null,
          accounts: {
            create: {
              provider: 'github',
              providerAccountId: profile.id,
              username: profile.username || null,
            },
          },
        },
      });

      return done(null, newUser);
    },
  ),
);
