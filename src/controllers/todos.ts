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

export const createTodo = async (ctx: Context): Promise<void> => {
  const { title, position, listId } = ctx.request.body
  const todo: Todo = {
    id: uuidv4(),
    title,
    isCompleted: false,
    listId,
    position,
  }
  const createdTodo = await insertOne(todo)
  ctx.ok(createdTodo)
}

export const getListTodos = async (ctx: Context): Promise<void> => {
  const { id: listId } = ctx.params
  const todos = await findMany(listId)
  ctx.ok(todos)
}

export const editTodo = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params
  const { editedTodo } = ctx.request.body
  await updateOne(id, editedTodo)
  await findOne(id).then((res) => {
    ctx.ok(res)
  })
}

export const deleteTodo = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params
  const todo = await findOne(id)
  console.log(todo, id)
  if (todo) {
    await deleteOne(id)
    ctx.ok({ todoId: id })
  } else {
    await deleteCompleted(id)
    ctx.ok({ id })
  }
}

export const clearCompleted = async (ctx: Context): Promise<void> => {
  const { listId } = ctx.request.body
  await deleteCompleted(listId)
  ctx.ok({ listId })
}

export const deleteListTodos = async (ctx: Context): Promise<void> => {
  const { id: listId } = ctx.params
  await deleteMany(listId)
  ctx.ok({ listId })
}
