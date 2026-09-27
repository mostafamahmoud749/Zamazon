import passport from 'passport';
import { Strategy } from 'passport-local';
import { compareHased } from '../utils/helpers.js';
import { prisma } from '@/prisma/lib/prisma.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userId = Number(id);

    if (!Number.isInteger(userId)) return done(null, false);

    const findUser =
      (await prisma.user.findUnique({ where: { id: userId } })) ||
      (await prisma.githubUser.findUnique({ where: { githubID: userId } }));

    if (!findUser) return done(null, false);

    if ('email' in findUser) {
      return done(null, findUser);
    }

    return done(null, {
      id: findUser.githubID,
      githubID: findUser.githubID,
      userName: findUser.userName,
    });
  } catch (err) {
    done(err, undefined);
  }
});

export default passport.use(
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const findUser = await prisma.user.findUnique({ where: { email: username } });

      if (!findUser) throw new Error('User not found!');

      if (!compareHased(password, findUser.password)) throw new Error('Bad Credentials');

      done(null, findUser);
    } catch (err) {
      return done(err, false);
    }
  }),
);
