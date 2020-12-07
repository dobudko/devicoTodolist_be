import config from '../config'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import Context from '../types/Context'
import jwtDecode from 'jwt-decode'
import { findOne, insertOne } from '../models/users'
import {
  createTokens,
  deleteRefreshTokenFromDb,
  insertRefreshTokenToDb,
} from '../util/tokenUtils'

export const getUserByLogin = async (ctx: Context): Promise<any> => {
  const { login, password } = ctx.request.body
  const user = await findOne('login', login)
  if (!user) {
    ctx.status = 200
    ctx.body = { validation: 'user with this login doesnt exist' }
  } else if (!bcrypt.compareSync(password, user.password)) {
    ctx.status = 200
    ctx.body = { validation: 'password doesnt match' }
  } else {
    const [refreshToken, accessToken] = createTokens(
      { id: user.id },
      config.jwtSecretRefreshKey + user.password
    )
    deleteRefreshTokenFromDb(user.id)
    insertRefreshTokenToDb(refreshToken, user.id)
    ctx.status = 200
    ctx.body = {
      login: user.login,
      accessToken: JSON.stringify(accessToken),
      refreshToken: JSON.stringify(refreshToken),
    }
  }
}

export const createUser = async (ctx: Context): Promise<any> => {
  const { login, password } = ctx.request.body
  if (!password) {
    ctx.status = 200
    ctx.body = { validation: 'password is empty' }
  } else if (await findOne('login', login)) {
    ctx.status = 200
    ctx.body = { validation: 'user with this login is already exist' }
  } else {
    const salt = bcrypt.genSaltSync(parseInt(config.saltRounds))
    const hash = bcrypt.hashSync(password, salt)
    const user = {
      id: uuidv4(),
      login: login,
      password: hash,
    }
    const gotUser = await insertOne(user)
    const [refreshToken, accessToken] = createTokens(
      { id: gotUser.id },
      config.jwtSecretRefreshKey + gotUser.password
    )
    deleteRefreshTokenFromDb(gotUser.id)
    insertRefreshTokenToDb(refreshToken, gotUser.id)
    ctx.status = 200
    ctx.body = {
      login: gotUser.login,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
  }
}

export const getUserById = async (ctx: Context): Promise<any> => {
  const token = ctx.request.headers['authorization']
  let decodedToken
  let user
  if (token !== 'undefined') {
    decodedToken = jwtDecode(token)
    if (decodedToken.exp > Date.now() / 1000) {
      user = await findOne('id', decodedToken['id'])
    }
  }
  ctx.status = 200
  ctx.body = {
    login: user ? user.login : null,
  }
}
