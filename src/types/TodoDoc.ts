import { Document } from 'mongoose'

interface ITodo extends Document {
  id: string
  title: string
  isCompleted: boolean
  listId: string
  position: number
}

export default ITodo