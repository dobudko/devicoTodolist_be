import {
  deleteMany,
  deleteOne,
  findMany,
  insertOne,
  updateOne,
} from '../models/todos'
import { v4 as uuidv4 } from 'uuid'
import Context from '../types/Context'

export const createTodo = async (ctx: Context): Promise<any> => {
  const { title } = ctx.request.body
  const { id: userId } = ctx.state
  const todo = {
    id: uuidv4(),
    title: title,
    isCompleted: false,
    userId: userId,
  }
  const createdTodo = await insertOne(todo)
  ctx.status = 200
  ctx.body = createdTodo
}

export const getUserTodos = async (ctx: Context): Promise<any> => {
  const { id: userId } = ctx.state
  const todos = await findMany(userId)
  ctx.status = 200
  ctx.body = todos
}

export const editTodo = async (ctx: Context): Promise<any> => {
  const { id } = ctx.params
  const { editedTodo } = ctx.request.body
  const promise = await updateOne(id, editedTodo)
  ctx.status = 200
  ctx.body = promise
}

export const deleteTodo = async (ctx: Context): Promise<any> => {
  const { id } = ctx.params
  const promise = await deleteOne(id)
  ctx.status = 200
  ctx.body = promise
}

export const clearCompleted = async (ctx: Context): Promise<any> => {
  const { id: userId } = ctx.state
  const todos = await deleteMany(userId)
  ctx.status = 200
  ctx.body = todos
}
