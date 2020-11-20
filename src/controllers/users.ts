import { saltRounds, tokenKey } from "../constants"
import { usersCollection } from "../models/users"
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import { v4 as uuidv4 } from 'uuid'

export const getUser = async (ctx) => {
  const { login, password } = ctx.request.body
  const user = await usersCollection.getUser(login)
  if (!user) {
    ctx.status = 200
    ctx.body = { validation: 'user with this login doesnt exist'}
  } else if (!bcrypt.compareSync(password, user.password)) {
    ctx.status = 200
    ctx.body = { validation: 'password doesnt match'}
  } else {
    ctx.status = 200
    ctx.body = { 
      id: user.id,
      login: user.login,
      token: jwt.sign({ id: user.id }, tokenKey),
    }
  }
}

export const createUser = async (ctx) => {
  const { login, password } = ctx.request.body
  if (!password) {
    ctx.status = 200
    ctx.body = { validation: 'password is empty'}
  } else if ((await usersCollection.getUser(login))) {
    ctx.status = 200
    ctx.body = { validation: 'user with this login is already exist'}
  } else {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)
    let user = {
      id: uuidv4(),
      login: login,
      password: hash,
    }
    user = await usersCollection.insertUser(user)
    ctx.status = 200
    ctx.body = { 
      id: user.id,
      login: user.login,
      token: jwt.sign({ id: user.id }, tokenKey),
    }
  }
}