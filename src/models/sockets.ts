import mongoose from '../db'
import ISockets from '../types/SocketsDoc'
import Sockets from '../types/Sockets'

const SocketsScheme: mongoose.Schema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  socketId: { type: String, required: true },
})

const sockets: mongoose.Model<ISockets> = mongoose.model(
  'sockets',
  SocketsScheme
)

export const findMany = async (
  field: string,
  value: string
): Promise<ISockets[]> => {
  const result = await sockets.find({ [field]: value })
  return result
}

export const findOne = async (socketId: string): Promise<ISockets> => {
  const result = await sockets.findOne({ socketId })
  return result
}

export const insertOne = async (socket: Sockets): Promise<ISockets> => {
  const newSocket: Sockets = new sockets({
    id: socket.id,
    userId: socket.userId,
    socketId: socket.socketId,
  })
  const result = await sockets.create(newSocket)
  return result
}

export const deleteOne = async (socketId: string): Promise<void> => {
  await sockets.deleteOne({ socketId })
}

export const deleteMany = async (userId: string): Promise<void> => {
  await sockets.deleteMany({ userId })
}
