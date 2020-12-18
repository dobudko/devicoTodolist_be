import * as Koa from 'koa'
import * as cors from '@koa/cors'
import * as bodyParser from 'koa-body'
import logger from './src/logger'
import * as Router from 'koa-router'
import jwtDecode from 'jwt-decode'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import userRouter from './src/routes/users'
import todoRouter from './src/routes/todos'
import todoListsRouter from './src/routes/todoLists'
import sharedListsRouter from './src/routes/sharedLists'
import Context from './src/types/Context'
import {
  deleteRefreshTokenFromDb,
  insertRefreshTokenToDb,
} from './src/util/tokenUtils'
import { refreshToken as refresh } from './src/util/tokenUtils'
import { findOne } from './src/models/users'
import makeResponse from './src/util/makeResponse'
import sharingAvailableUsersRouter from './src/routes/sharingAvailableUsers'
import {
  insertOne as insertSocket,
  deleteOne as deleteSocket,
} from './src/models/sockets'
import Sockets from './src/types/Sockets'

const router = new Router()
const privateRoutes = new Router()
const refreshRouter = new Router()

const checkSecure = async (ctx: Context, next: any): Promise<any> => {
  const token = ctx.request.headers['authorization']
  const decodedToken = jwtDecode(token)
  if (!(await findOne('id', decodedToken['id']))) {
    ctx.status = 400
    return
  }
  ctx.state = decodedToken
  await next()
}

const refreshToken = async (ctx: Context) => {
  const { refreshToken: rt } = ctx.request.body
  if (rt !== 'undefined') {
    const decodedToken = jwtDecode(rt)
    if (decodedToken['exp'] > Date.now() / 1000) {
      const user = await findOne('id', decodedToken['id'])
      const { accessToken, refToken } = await refresh(rt)
      await deleteRefreshTokenFromDb(user.id)
      await insertRefreshTokenToDb(refToken, user.id)
      ctx.body = {
        accessToken: JSON.stringify(accessToken),
        refreshToken: JSON.stringify(refToken),
      }
    }
  }

  if (!ctx.body) {
    ctx.body = {
      status: 200,
    }
  }
  ctx.status = 200
}

const initApp = () => {
  const app = new Koa()

  refreshRouter.post('/refresh', refreshToken)
  router.use('/user', userRouter)
  privateRoutes.use('/todos', todoRouter)
  privateRoutes.use('/lists', todoListsRouter)
  privateRoutes.use('/sharedLists', sharedListsRouter)
  privateRoutes.use('/sharingAvailableUsers', sharingAvailableUsersRouter)

  app.use(logger)
  app.use(cors())
  app.use(bodyParser())
  app.use(makeResponse)
  app.use(router.routes())
  app.use(refreshRouter.routes())
  app.use(checkSecure)
  app.use(privateRoutes.routes())
  return app
}

const app = initApp()
const server = createServer(app.callback())
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.use(async (socket, next) => {
  const userToken = socket.handshake.auth['token']
  if (userToken) {
    const userId: string = jwtDecode(userToken)['id']
    const newSocket: Sockets = {
      id: uuidv4(),
      userId,
      socketId: socket.id,
    }
    await insertSocket(newSocket)
  }
  next()
})

io.on('connection', function (socket) {
  socket.on('disconnect', async () => {
    await deleteSocket(socket.id)
  })
})

export { io }

server.listen(8080)
