import User from '../types/User'
import mongoose from '../db/index'
import IUser from '../types/UserDoc'

const usersScheme = new mongoose.Schema({
  id: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
})

const Users: mongoose.Model<IUser> = mongoose.model('users', usersScheme)

export const insertOne = async (user: User): Promise<IUser> => {
  const result = await Users.create({ ...user })
  return result
}

export const findOne = async (field: string, value: string): Promise<IUser> => {
  const result = await Users.findOne({ [field]: value })
  return result
}

export const findMany = async (): Promise<IUser[]> => {
  const result = await Users.find({})
  return result
}
