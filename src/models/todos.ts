import Todo from '../types/Todo'
import mongoose from '../db/index'

const Schema = mongoose.Schema

const todosScheme = new Schema({
  id: String,
  title: String,
  isCompleted: Boolean,
  userId: String,
})

const Todos = mongoose.model('todos', todosScheme)

export const findMany = async (userId: string): Promise<Todo[]> => {
  let result
  await Todos.find({ userId }).then((doc) => {
    result = doc
  })
  return result
}

export const insertOne = async (todo: Todo): Promise<Todo> => {
  let result
  await Todos.create({ ...todo }).then((doc) => {
    result = doc
  })
  return result
}

export const findOne = async (todo: Todo): Promise<Todo> => {
  let result
  await Todos.find({ id: todo.id }).then((doc) => {
    result = doc
  })
  return result
}

export const updateOne = async (id: string, todo: Todo): Promise<Todo> => {
  let result
  await Todos.updateOne(
    { id },
    { title: todo.title, isCompleted: todo.isCompleted }
  ).then((doc) => {
    result = doc
  })
  return result
}

export const deleteOne = async (id: string): Promise<Todo> => {
  let result
  await Todos.deleteOne({ id }).then((doc) => {
    result = doc
  })
  return result
}

export const deleteMany = async (userId: string): Promise<Todo[]> => {
  let result
  await Todos.deleteMany({ userId, isCompleted: true }).then((doc) => {
    result = doc
  })
  return result
}
