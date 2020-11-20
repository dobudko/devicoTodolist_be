const http = require('http')
import { v4 as uuidv4 } from 'uuid'
const bcrypt = require('bcrypt')
import { saltRounds, tokenKey } from './src/constants'
import { usersCollection } from './src/models/users'
const jwt = require('jsonwebtoken')

const createUser = (payload: { login: string; password: string }) => {
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash = bcrypt.hashSync(payload.password, salt)
  const user = {
    id: uuidv4(),
    login: payload.login,
    password: hash,
  }
  return user
}

const server = http.createServer(async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  if (req.method === 'POST') {
    if (req.url === '/login') {
      let login = ''
      let password = ''
      await new Promise((resolve?: (value?: string) => void) => {
        req.on('data', (chunk: Buffer) => {
          const userData = chunk.toString().split(',')
          login = userData[0].substring(10, userData[0].length - 1)
          password = userData[1].substring(12, userData[1].length - 2)
          resolve()
        })
      })
      const user = await usersCollection.getUser(login)
      if (!user) {
        res.statusCode = 200
        res.write(JSON.stringify({ validation: 'user with this login doesnt exist'}))
      } else if (bcrypt.compareSync(password, user.password)) {
        res.statusCode = 200
        res.write(
          JSON.stringify({
            id: user.id,
            login: user.login,
            token: jwt.sign({ id: user.id }, tokenKey),
          })
        )
      } else {
        res.statusCode = 200
        res.write(JSON.stringify({ validation: 'password doesnt match'}))
      }
    } else if (req.url === '/register') {
        let login = ''
        let password = ''
        await new Promise((resolve?: (value?: string) => void) => {
          req.on('data', (chunk: Buffer) => {
            const userData = chunk.toString().split(',')
          login = userData[0].substring(10, userData[0].length - 1)
          password = userData[1].substring(12, userData[1].length - 2)
            resolve()
          })
        })
        if (!password) {
          res.statusCode = 200
          res.write(JSON.stringify({ validation: 'password is empty'}))
        } else if (!(await usersCollection.getUser(login))) {
          let user = createUser({
          login: login,
          password: password,
          })
          user = await usersCollection.insertUser(user)
          res.statusCode = 200
          res.write(
            JSON.stringify({
              id: user.id,
              login: user.login,
              token: jwt.sign({ id: user.id }, tokenKey),
            })
          )
        } else {
          res.statusCode = 200
          res.write(JSON.stringify({ validation: 'user with this login is already exist'}))
      }
    }
  }
  res.end()
})

server.listen(8080)
