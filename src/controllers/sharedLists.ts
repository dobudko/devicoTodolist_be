import { findMany, insertOne } from '../models/sharedLists'
import Context from '../types/Context'
import SharedLists from '../types/SharedLists'
import { v4 as uuidv4 } from 'uuid'
import { findOne } from '../models/todoLists'

export const getUserSharedLists = async (ctx: Context): Promise<void> => {
  const { id: userId } = ctx.state
  const sharedLists = await findMany('userId', userId)
  const lists = new Array(sharedLists.length)
  for (let i = 0; i < sharedLists.length; i++) {
    lists[i] = await findOne(sharedLists[i].listId)
  }
  ctx.ok(lists)
}

export const createSharedList = async (ctx: Context): Promise<void> => {
  const { userId, listId } = ctx.request.body
  const sharedList: SharedLists = {
    id: uuidv4(),
    userId,
    listId,
  }
  const createdList = await insertOne(sharedList)
  ctx.ok(createdList)
}
