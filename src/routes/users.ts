import { createUser, getUser } from "../controllers/users"

const Router = require('koa-router')

const router = new Router()

router.post('/login', getUser)

router.post('/register', createUser)

export default router.routes()