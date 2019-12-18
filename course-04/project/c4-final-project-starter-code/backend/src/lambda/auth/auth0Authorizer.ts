import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// const auth0Secret = process.env.AUTH_0_SECRET
const secret = `-----BEGIN CERTIFICATE-----
MIIDAzCCAeugAwIBAgIJDTXQ8iOixnvMMA0GCSqGSIb3DQEBCwUAMB8xHTAbBgNV
BAMTFHN1c2FuODgzMjMuYXV0aDAuY29tMB4XDTE3MDcwNjIwNTI0NVoXDTMxMDMx
NTIwNTI0NVowHzEdMBsGA1UEAxMUc3VzYW44ODMyMy5hdXRoMC5jb20wggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC0WAboifhGfx7eDU4vGeKolPItpvvj
Q2orrXsty3a5KQzu2nxhg7kCQy/eTsrdTAWgr1etAW5pKjClQFRIHDUGLT9XRkvl
UT10BVU3D7xIgJKvEXAntS5TD+Rmq4bI/Nbxfwny89+wenLnNs8oWb3I7jVnmWyy
OXfuIpIAlvlwGok4EOH1mmjjFEeZ9p50gRLX/4w4p8EO6fzP6r7jlthxAdEg0i7C
3fuf4fnTuQ9TGpuUjDNoaR9SKUt+joGf5eVy4XYYK9pd3z0RGYxzP7RoAOkXAWi4
/T/WEV4BCw92WcYUuAQXrLaYoiLio3Yk7YwQMhuldam8+/Ar0/Oz6rz9AgMBAAGj
QjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFHAnPZesBq6ZfDv6h7MVoc2Z
rFrwMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAlHv2ORnysEPk
ygRpWbZ/i6Muc2DiRjuWkzaf/5tu95+Q69GJ32VuHA9MhvyR3KAHdF2OhKZqAIa8
2j2r310SUPwKRBFtjIVnPAyauYdvQxBYhFS8Ph8EMuE0+vCpo0uuDHNpgMztwxLG
XIdv1ZIwGuIcFoWlz+VsXQxlI5ffpuqpNZ/iwZ7cpMnTOGiLUpyKtg9wJl30LYuL
CHzY2GjoxcuQMZ4bOjolW06qF7KSOxvXzjq/3hA+OUF7o9qDi+8E4Czoz9Sjmtmh
uitIejf/KyL8KsNtv9/KTlluYG0+mOZJTuxRQJkMFzE981HJdPCxcAvelDNjbmUQ
Dr129zedPA==
-----END CERTIFICATE-----
`

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = '...'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  console.log('walalalal', event)
  try {
    const jwtToken = verifyToken(
      event.authorizationToken)
    logger.info('User was authorized', jwtToken)
    console.log('user authorized', jwtToken)

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
    console.log('We have error!!', e)

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

function verifyToken(authHeader: string): JwtPayload {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  console.log('The jwt', jwt)

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  // return verify(token, auth0Secret) as JwtPayload
  return verify(token, secret, {algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

