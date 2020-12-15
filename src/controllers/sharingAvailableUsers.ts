import { findMany, insertOne } from '../models/sharedLists'
import Context from '../types/Context'
import SharedLists from '../types/SharedLists'
import { v4 as uuidv4 } from 'uuid'
import { findMany as findAllUsers } from '../models/users'

export const getSharingAvailableUsers = async (ctx: Context): Promise<void> => {
  const { id } = ctx.state
  const { id: listId } = ctx.params
  let sharedLists
  await findMany('listId', listId).then((res) => {
    sharedLists = res
  })
  let availableUsers
  await findAllUsers()
    .then((res) => {
      const users = res.map((user) => ({ id: user.id, login: user.login }))
      if (sharedLists) {
        const unavailableUsers = sharedLists.map((item) => item.userId)
        availableUsers = users.filter(
          (user) => !unavailableUsers.includes(user.id) && user.id !== id
        )
      } else {
        availableUsers = users.filter((user) => user.id !== id)
      }
    })
    .then(() => {
      ctx.ok(availableUsers)
    })
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
