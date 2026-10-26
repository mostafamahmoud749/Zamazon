import 'dotenv/config';
import passport from 'passport';
import { Strategy, type Profile } from 'passport-github';
import type { VerifyCallback } from 'passport-oauth2';
import { prisma } from '@/prisma/lib/prisma.js';
import { getVerifiedGitHubEmail } from '../services/githubEmail.js';

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
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
      // @ts-expect-error passport-github types restrict OAuth2's boolean state option to strings.
      state: true,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) {
      try {
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

        const email = await getVerifiedGitHubEmail(accessToken);

        if (!profile.id || !email) {
          return done(null, false, {
            message: 'A verified GitHub email is required',
          });
        }

        const newUser = await prisma.user.create({
          data: {
            email,
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
      } catch (error) {
        return done(error);
      }
    },
  ),
);
