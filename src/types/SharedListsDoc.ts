import {Document} from 'mongoose'

interface SharedListsDoc extends Document {
  id: string
  userId: string
  listId: string
}

export default SharedListsDoc
