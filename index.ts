import * as Koa from 'koa'
import * as cors from '@koa/cors'
import * as bodyParser from 'koa-body'
import logger from './src/logger'
import * as Router from 'koa-router'
import jwtDecode from 'jwt-decode'
import * as jwt from 'jsonwebtoken'

import userRouter from './src/routes/users'
import todoRouter from './src/routes/todos'
import config from './src/config'

const router = new Router()
const privateRoutes = new Router()

const checkSecure = async (ctx: any, next: any): Promise<any> => {
  const token = ctx.request.headers['authorization']
  const decodedToken = jwtDecode(token)
  if (token !== jwt.sign(JSON.stringify(decodedToken), config.token)) {
    ctx.status = 400
    return
  }
  ctx.state = decodedToken
  await next()
}

const initApp = () => {
  const app = new Koa()

  router.use('/user', userRouter)
  privateRoutes.use('/todos', todoRouter)

  app.use(logger)
  app.use(cors())
  app.use(bodyParser())
  app.use(router.routes())
  app.use(checkSecure)
  app.use(privateRoutes.routes())
  return app
}

const app = initApp()
app.listen(8080)
