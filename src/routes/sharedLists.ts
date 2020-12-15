import * as Router from 'koa-router'
import {
  getUserSharedLists,
  createSharedList,
} from '../controllers/sharedLists'

const router = new Router()

router.get('/', getUserSharedLists)

router.post('/', createSharedList)

export default router.routes()
