import { Document } from 'mongoose'

interface ITodo extends Document {
  id: string
  title: string
  isCompleted: boolean
  userId: string
}

export default ITodo