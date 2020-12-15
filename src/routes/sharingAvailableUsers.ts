import * as Router from 'koa-router'
import { createSharedList } from '../controllers/sharedLists'
import { getSharingAvailableUsers } from '../controllers/sharingAvailableUsers'

const router = new Router()

router.get('/:id', getSharingAvailableUsers)

router.post('/', createSharedList)

export default router.routes()
