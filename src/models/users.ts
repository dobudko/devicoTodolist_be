import { connectToMongoDb, getCollection } from '../db'
import User from '../types/User'

export const usersCollection = {
  name: 'users',

  async insertUser(user: User): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.insertOne(user)
    client.close()
    return result
  },

  async getUser(login: string): Promise<any> {
    const client = await connectToMongoDb()
    const collection = getCollection(this.name)
    const result = collection.findOne({ login: login })
    client.close()
    return result
  },
}
