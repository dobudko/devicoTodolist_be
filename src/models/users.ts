import User from '../types/User'
import mongoose from '../db/index'

const Schema = mongoose.Schema

const usersScheme = new Schema({
  id: String,
  login: String,
  password: String,
})

const Users = mongoose.model('users', usersScheme)

export const insertOne = async (user: User): Promise<User> => {
  let result
  await Users.create({ ...user }).then((doc) => {
    result = doc
  })
  return result
}

export const findOne = async (field: string, value: string): Promise<User> => {
  let result
  await Users.findOne({ [field]: value }).then((doc) => {
    result = doc
  })
  return result
}
