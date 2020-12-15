import mongoose from '../db'
import SharedLists from '../types/SharedLists'
import ISharedLists from '../types/SharedListsDoc'

const SharedListScheme: mongoose.Schema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  listId: { type: String, required: true },
})

const sharedLists: mongoose.Model<ISharedLists> = mongoose.model(
  'sharedlists',
  SharedListScheme
)

export const findMany = async (
  field: string,
  value: string
): Promise<ISharedLists[]> => {
  const result = await sharedLists.find({ [field]: value })
  return result
}

export const insertOne = async (
  sharedList: SharedLists
): Promise<ISharedLists> => {
  const newSharedList: SharedLists = new sharedLists({
    id: sharedList.id,
    userId: sharedList.userId,
    listId: sharedList.listId,
  })
  const result = await sharedLists.create(newSharedList)
  return result
}

export const deleteOne = async (id: string): Promise<void> => {
  await sharedLists.deleteOne({ id })
}

export const deleteMany = async (userId: string): Promise<void> => {
  await sharedLists.deleteMany({ userId })
}
