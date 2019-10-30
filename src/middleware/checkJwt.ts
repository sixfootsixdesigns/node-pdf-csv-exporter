import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`,
  }),
  audience: 'YOUR_API_IDENTIFIER',
  issuer: `https://YOUR_DOMAIN/`,
  algorithms: ['RS256'],
});
