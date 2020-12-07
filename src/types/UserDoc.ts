import { Document } from 'mongoose'

interface IUser extends Document {
  id: string
  login: string
  password: string
}

export default IUser