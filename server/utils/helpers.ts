import bcrypt from 'bcrypt';

const saltRounds = 10;

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

export function compareHased(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}
