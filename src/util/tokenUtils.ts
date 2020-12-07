import * as jwt from 'jsonwebtoken'
import config from '../config/index'
import mongoose from '../db/index'
import { findOne } from '../models/users'
import IToken from '../types/TokenDoc'

const tokensScheme = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
})

const Tokens: mongoose.Model<IToken> = mongoose.model('tokens', tokensScheme)

export const createToken = (
  payload: any,
  secretKey: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secretKey, {
    expiresIn: expiresIn,
  })
}

export const createTokens = (payload: any, refreshSecret: string): string[] => {
  const accessToken = createToken(
    payload,
    config.jwtSecretAccessKey,
    config.jwtAccessTokenExpires
  )
  const refreshToken = createToken(
    payload,
    refreshSecret,
    config.jwtRefreshTokenExpires
  )
  return [accessToken, refreshToken]
}

export const refreshToken = async (
  rt: string
): Promise<{ accessToken: string; refToken: string }> => {
  const decode = jwt.decode(JSON.parse(rt))
  if (!decode['id']) {
    return
  }
  const user = await findOne('id', decode.id)
  if (!user) {
    return
  }
  const refreshSecret = config.jwtSecretRefreshKey + user.password
  const [accessToken, refToken] = createTokens({ id: user.id }, refreshSecret)

  if (accessToken && refToken) {
    return { accessToken, refToken }
  } else {
    return
  }
}

export const insertRefreshTokenToDb = async (
  refreshToken: string,
  userId: string
): Promise<IToken> => {
  const result = await Tokens.create({ token: refreshToken, userId })
  return result
}

export const findRefreshTokenFromDb = async (
  userId: string
): Promise<IToken> => {
  const result = await Tokens.findOne({ userId })
  return result
}

export const deleteRefreshTokenFromDb = async (
  userId: string
): Promise<void> => {
  await Tokens.deleteMany({ userId })
}
