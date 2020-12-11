import mongoose from '../db/index'
import TodoLists from '../types/TodoLists'
import ITodoLists from '../types/TodoListsDoc'

const todoListScheme: mongoose.Schema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
})

const todoLists: mongoose.Model<ITodoLists> = mongoose.model(
  'todoLists',
  todoListScheme
)

export const findMany = async (userId: string): Promise<ITodoLists[]> => {
  const result = await todoLists.find({ userId })
  return result
}

export const findOne = async (id: string): Promise<ITodoLists> => {
  const result = await todoLists.findOne({ id })
  return result
}

export const insertOne = async (todoList: TodoLists): Promise<ITodoLists> => {
  const newList: TodoLists = new todoLists({
    id: todoList.id,
    title: todoList.title,
    userId: todoList.userId,
  })
  const result = await todoLists.create(newList)
  return result
}

export const deleteOne = async (id: string): Promise<void> => {
  await todoLists.deleteOne({ id })
}

export const deleteMany = async (userId: string): Promise<void> => {
  await todoLists.deleteMany({ userId })
}

export const updateOne = async (
  id: string,
  todoList: TodoLists
): Promise<TodoLists> => {
  const result = await todoLists.updateOne(
    { id },
    {
      title: todoList.title,
    }
  )
  return result
}
