import { getCollection } from '../db'
import { connectToMongoDb } from '../db'
import Todo from '../types/Todo'

export const todosCollection = {
  name: 'todos',

  async insertTodo(todo: Todo) {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.insertOne(todo)
    client.close()
    return result
  },

  async findTodo(todo: Todo) {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    let result = []
    collection.find(todo).toArray((err, res) => {
      result = res
      console.log(res)
    })
    client.close()
    return result
  },

  async deleteTodo(todo: Todo) {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.deleteOne({ title: todo.title })
    client.close()
    return result
  },
}
