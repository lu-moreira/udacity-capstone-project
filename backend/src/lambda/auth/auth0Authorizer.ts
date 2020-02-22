import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode, Secret } from 'jsonwebtoken'
import Axios from 'axios'
import { createLogger } from '../../infra/logger/logger'
import { JwtPayload } from '../../domain/auth/JwtPayload'
import { Jwks, Key } from '../../domain/auth/Jwks'
import { Jwt } from '../../domain/auth/Jwt'

const logger = createLogger('auth')
const jwksUrl = 'https://dev-lmm-br.auth0.com/.well-known/jwks.json'
let jwksCached: Jwks;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

/**
 * Taken from https://gist.github.com/chatu/7738411c7e8dcf604bc5a0aad7937299
 * @param cert 
 */
const certToPEM = (cert: string): Secret => {
  cert = cert.match(/.{1,64}/g).join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {
    // Retrieve the JWKS and filter for potential signing keys
    const jwks: Jwks = await getJwks()
    // Extract the JWT from the request's authorization header.
    const token = getToken(authHeader)
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    // Decode the JWT and grab the kid property from the header.
    const authHdrKid = jwt.header.kid;
    // Find a signing key in the filtered JWKS with a matching kid property
    const signingKey: Key = jwks.keys.filter(key => key.kid == authHdrKid)[0]
    // Using the x5c property build a certificate which will be used to verify the JWT signature.
    const pem = certToPEM(signingKey.x5c[0])
    // Ensure the JWT contains the expected audience, issuer, expiration, etc.
    verify(token, pem);
    // This is async function, so return the result as a promise that resolves to the payload
    return Promise.resolve(jwt.payload);
  }
  catch (e) {
    logger.error(e)
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function getJwks(): Promise<Jwks> {
  if (!jwksCached)
    jwksCached = await Axios.get(jwksUrl);
  return jwksCached
}