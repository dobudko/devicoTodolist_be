import { getCollection } from '../db'
import { connectToMongoDb } from '../db'
import Todo from '../types/Todo'

export const todosCollection = {
  name: 'todos',

  async insertTodo(todo: Todo): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.insertOne(todo)
    client.close()
    return result
  },

  async findTodo(todo: Todo): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.findOne({ id: todo.id })
    client.close()
    return result
  },

  async getUserTodos(userId: string): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.find({ userId: userId }).toArray()
    client.close()
    return result
  },

  async editTodo(id: string, todo: Todo): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.updateOne(
      { id: id },
      { $set: { title: todo.title, isCompleted: todo.isCompleted } }
    )
    client.close()
    return result
  },

  async deleteTodo(id: string): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.deleteOne({ id: id })
    client.close()
    return result
  },

  async clearCompleted(userId: string): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.deleteMany({ userId: userId, isCompleted: true })
    client.close()
    return result
  },
}
