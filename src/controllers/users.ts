import config from '../config'
import { usersCollection } from '../models/users'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export const getUser = async (ctx: any): Promise<any> => {
  const { login, password } = ctx.request.body
  const user = await usersCollection.getUser(login)
  if (!user) {
    ctx.status = 200
    ctx.body = { validation: 'user with this login doesnt exist' }
  } else if (!bcrypt.compareSync(password, user.password)) {
    ctx.status = 200
    ctx.body = { validation: 'password doesnt match' }
  } else {
    ctx.status = 200
    ctx.body = {
      token: jwt.sign(JSON.stringify({ id: user.id }), config.token),
    }
  }
}

export const createUser = async (ctx: any): Promise<any> => {
  const { login, password } = ctx.request.body
  if (!password) {
    ctx.status = 200
    ctx.body = { validation: 'password is empty' }
  } else if (await usersCollection.getUser(login)) {
    ctx.status = 200
    ctx.body = { validation: 'user with this login is already exist' }
  } else {
    const salt = bcrypt.genSaltSync(config.saltRounds)
    const hash = bcrypt.hashSync(password, salt)
    let user = {
      id: uuidv4(),
      login: login,
      password: hash,
    }
    user = await usersCollection.insertUser(user)
    ctx.status = 200
    ctx.body = {
      token: jwt.sign({ id: user.id }, config.token),
    }
  }
}
