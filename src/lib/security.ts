import { sign } from 'jsonwebtoken';

export const createJwt = (user: any = {}, secret: string, issuer: string = 'exporter') => {
  const options = {
    algorithm: 'HS256',
    expiresIn: '5m',
    issuer,
  };
  const signature = sign(user, secret, options);
  return `Bearer ${signature}`;
};
