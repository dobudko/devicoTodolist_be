import { Document } from 'mongoose'

interface IToken extends Document {
  token: string
  userId: string
}

export default IToken
