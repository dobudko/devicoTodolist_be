const Koa = require('koa');
const logger = require('koa-morgan');
const cors = require('@koa/cors');
const bodyParser = require('koa-body')();

import userRouter from './src/routes/users'

const initApp = () => {
  const app = new Koa()

  app.use(logger('tiny'))
  app.use(cors())
  app.use(bodyParser)
  app.use(userRouter)

  return app
}

const app = initApp()
app.listen(8080)