import {Document} from 'mongoose'

interface SocketsDoc extends Document {
  id: string
  userId: string
  socketId: string
}

export default SocketsDoc
