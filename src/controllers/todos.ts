import { todosCollection } from '../models/todos'
import { v4 as uuidv4 } from 'uuid'

export const createTodo = async (ctx: any): Promise<any> => {
  const { title } = ctx.request.body
  const { id: userId } = ctx.state
  const todo = {
    id: uuidv4(),
    title: title,
    isCompleted: false,
    userId: userId,
  }
  const createdTodo = await todosCollection.insertTodo(todo)
  ctx.status = 200
  ctx.body = createdTodo['ops'][0]
}

export const getUserTodos = async (ctx: any): Promise<any> => {
  const { id: userId } = ctx.state
  const todos = await todosCollection.getUserTodos(userId)
  ctx.status = 200
  ctx.body = todos
}

export const editTodo = async (ctx: any): Promise<any> => {
  const { id } = ctx.params
  const { editedTodo } = ctx.request.body
  const promise = await todosCollection.editTodo(id, editedTodo)
  ctx.status = 200
  ctx.body = promise
}

export const deleteTodo = async (ctx: any): Promise<any> => {
  const { id } = ctx.params
  const promise = await todosCollection.deleteTodo(id)
  ctx.status = 200
  ctx.body = promise
}

export const clearCompleted = async (ctx: any): Promise<any> => {
  const { id: userId } = ctx.state
  const todos = await todosCollection.clearCompleted(userId)
  ctx.status = 200
  ctx.body = todos
}
