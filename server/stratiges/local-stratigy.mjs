import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../mongoose/schemas/users.mjs';
import { compareHased } from '../utils/helpers.mjs';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);

    if (!findUser) throw new Error('User not found!');

    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const findUser = await User.findOne({ email: username });

      if (!findUser) throw new Error('User not found!');

      if (!compareHased(password, findUser.password)) throw new Error('Bad Credentials');

      done(null, findUser);
    } catch (err) {
      return done(err, null);
    }
  }),
);
