import Context from '../types/Context'
import TodoLists from '../types/TodoLists'
import { v4 as uuidv4 } from 'uuid'
import {
  deleteMany,
  deleteOne,
  findMany,
  findOne,
  insertOne,
  updateOne,
} from '../models/todoLists'
import { deleteMany as deleteManyTodos } from '../models/todos'

export const createList = async (ctx: Context): Promise<void> => {
  const { title } = ctx.request.body
  const { id: userId } = ctx.state
  const list: TodoLists = {
    id: uuidv4(),
    title,
    userId,
  }
  const createdList = await insertOne(list)
  ctx.ok(createdList)
}

export const getUserLists = async (ctx: Context): Promise<void> => {
  const { id: userId } = ctx.state
  const lists = await findMany(userId)
  ctx.ok(lists)
}

export const getList = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params
  const list = await findOne(id)
  ctx.ok(list)
}

export const editList = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params
  const { editedList } = ctx.request.body
  const list = await updateOne(id, editedList)
  ctx.ok(list)
}

export const deleteList = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params
  await deleteOne(id)
  await deleteManyTodos(id)
  ctx.ok({ id })
}

export const deleteUserLists = async (ctx: Context): Promise<void> => {
  const { id: userId } = ctx.state
  await deleteMany(userId)
  ctx.ok(userId)
}
