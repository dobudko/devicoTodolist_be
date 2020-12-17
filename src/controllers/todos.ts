import {
  deleteCompleted,
  deleteMany,
  deleteOne,
  findMany,
  findOne,
  insertOne,
  updateOne,
} from '../models/todos'
import { v4 as uuidv4 } from 'uuid'
import Context from '../types/Context'
import Todo from '../types/Todo'
import {
  socketAddTodo,
  socketClearComplete,
  socketDeleteTodo,
  socketEditTodo,
} from '../socket'

export const createTodo = async (ctx: Context): Promise<void> => {
  const { id } = ctx.state
  const { title, position, listId } = ctx.request.body
  const todo: Todo = {
    id: uuidv4(),
    title,
    isCompleted: false,
    listId,
    position,
  }
  await insertOne(todo).then((res) => {
    ctx.ok(res)
    socketAddTodo(res, id)
  })
}

export const getListTodos = async (ctx: Context): Promise<void> => {
  const { id: listId } = ctx.params
  const todos = await findMany(listId)
  ctx.ok(todos)
}

export const editTodo = async (ctx: Context): Promise<void> => {
  const { id: userId } = ctx.state
  const { id } = ctx.params
  const { editedTodo } = ctx.request.body
  await updateOne(id, editedTodo)
  await findOne(id).then((res) => {
    ctx.ok(res)
    socketEditTodo(res, userId)
  })
}

export const deleteTodo = async (ctx: Context): Promise<void> => {
  const { id: userId } = ctx.state
  const { id } = ctx.params
  const todo = await findOne(id)
  if (todo) {
    await deleteOne(id).then(() => {
      ctx.ok({ todoId: id })
      socketDeleteTodo(id, userId, todo.listId)
    })
  } else {
    await deleteCompleted(id).then(() => {
      ctx.ok({ id })
      socketClearComplete(id, userId)
    })
  }
}

export const clearCompleted = async (ctx: Context): Promise<void> => {
  const { id: userId } = ctx.state
  const { listId } = ctx.request.body
  await deleteCompleted(listId)
  ctx.ok({ listId })
  socketClearComplete(listId, userId)
}

export const deleteListTodos = async (ctx: Context): Promise<void> => {
  const { id: listId } = ctx.params
  await deleteMany(listId)
  ctx.ok({ listId })
}
