import { Double } from 'mongodb'
import mongoose from '../db/index'
import Todo from '../types/Todo'
import ITodo from '../types/TodoDoc'

const todosScheme: mongoose.Schema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  userId: { type: String, required: true },
  position: { type: Number, required: true },
})

const Todos: mongoose.Model<ITodo> = mongoose.model('todos', todosScheme)

export const findMany = async (userId: string): Promise<ITodo[]> => {
  const result = await Todos.find({ userId })
  return result
}

export const insertOne = async (todo: Todo): Promise<ITodo> => {
  const newTodo: ITodo = new Todos({
    id: todo.id,
    title: todo.title,
    isCompleted: todo.isCompleted,
    userId: todo.userId,
    position: todo.position,
  })
  const result = await Todos.create(newTodo)
  return result
}

export const findOne = async (todo: Todo): Promise<ITodo> => {
  const result = await Todos.findOne({ id: todo.id })
  return result
}

export const updateOne = async (id: string, todo: Todo): Promise<ITodo> => {
  const result = await Todos.updateOne(
    { id },
    {
      title: todo.title,
      isCompleted: todo.isCompleted,
      position: todo.position,
    }
  )
  return result
}

export const deleteOne = async (id: string): Promise<void> => {
  await Todos.deleteOne({ id })
}

export const deleteMany = async (userId: string): Promise<void> => {
  await Todos.deleteMany({ userId, isCompleted: true })
}
