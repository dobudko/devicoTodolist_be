import { getUserById, createUser, getUserByLogin } from '../controllers/users'

import * as Router from 'koa-router'

const router = new Router()

router.get('/', getUserById)

router.post('/login', getUserByLogin)

router.post('/register', createUser)

export default router.routes()
