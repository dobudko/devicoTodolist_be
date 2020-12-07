import * as dotenv from 'dotenv'
dotenv.config()

const config = {
  jwtSecretAccessKey: process.env.JWT_SECRET_ACCESS_KEY,
  jwtSecretRefreshKey: process.env.JWT_SECRET_REFRESH_KEY,
  jwtAccessTokenExpires: process.env.JWT_ACCESS_TOKEN_EXPIRES,
  jwtRefreshTokenExpires: process.env.JWT_REFRESH_TOKEN_EXPIRES,
  jwtAudience: process.env.JWT_AUDIENCE,
  jwtIssuer: process.env.JWT_ISSUER,
  saltRounds: process.env.SALT_ROUNDS,
}

export default config
