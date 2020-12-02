import {
  clearCompleted,
  createTodo,
  deleteTodo,
  editTodo,
  getUserTodos,
} from '../controllers/todos'

import * as Router from 'koa-router'

const router = new Router()

router.get('/', getUserTodos)

router.post('/', createTodo)

router.patch('/:id', editTodo)

router.delete('/:id', deleteTodo)

router.delete('/', clearCompleted)

export default router.routes()
