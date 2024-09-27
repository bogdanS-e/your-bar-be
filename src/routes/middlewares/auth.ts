import { auth } from "express-oauth2-jwt-bearer";

export const protectedRoute = auth({
  audience: 'https://hello-world.example.com',
  issuerBaseURL: 'https://dev-8j9ru6to.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

export const readJWT = auth({
  audience: 'https://hello-world.example.com',
  issuerBaseURL: 'https://dev-8j9ru6to.us.auth0.com/',
  tokenSigningAlg: 'RS256',
  authRequired: false,
});