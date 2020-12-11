import {Document} from 'mongoose'

interface TodoListsDoc extends Document {
  id: string
  title: string
  userId: string
}

export default TodoListsDoc
