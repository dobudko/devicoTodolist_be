import * as Router from 'koa-router'
import {
  getUserLists,
  createList,
  editList,
  deleteList,
  deleteUserLists,
  getList,
} from '../controllers/todoLists'

const router = new Router()

router.get('/', getUserLists)

router.get('/:id', getList)

router.post('/', createList)

router.patch('/:id', editList)

router.delete('/', deleteUserLists)

router.delete('/:id', deleteList)

export default router.routes()
