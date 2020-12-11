import mongoose from '../db/index'
import Todo from '../types/Todo'
import ITodo from '../types/TodoDoc'

const todosScheme: mongoose.Schema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  listId: { type: String, required: true },
  position: { type: Number, required: true },
})

const Todos: mongoose.Model<ITodo> = mongoose.model('todos', todosScheme)

export const findMany = async (listId: string): Promise<ITodo[]> => {
  const result = await Todos.find({ listId })
  return result
}

export const insertOne = async (todo: Todo): Promise<ITodo> => {
  const newTodo: ITodo = new Todos({
    id: todo.id,
    title: todo.title,
    isCompleted: todo.isCompleted,
    listId: todo.listId,
    position: todo.position,
  })
  const result = await Todos.create(newTodo)
  return result
}

export const findOne = async (id: string): Promise<ITodo> => {
  const result = await Todos.findOne({ id })
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

export const deleteCompleted = async (listId: string): Promise<void> => {
  await Todos.deleteMany({ listId, isCompleted: true })
}

export const deleteMany = async (listId: string): Promise<void> => {
  await Todos.deleteMany({ listId })
}
