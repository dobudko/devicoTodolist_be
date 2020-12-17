import { io } from '../../index'
import Todo from '../types/Todo'
import { findMany as findSharedLists } from '../models/sharedLists'
import { findOne as findTodo } from '../models/todos'

const socketsMap: Map<string, string[]> = new Map()

export const socketAddTodo = async (
  addedTodo: Todo,
  userId: string
): Promise<void> => {
  const socketsId = socketsMap.get(userId)
  for (const socketId of socketsId) {
    io.to(socketId).emit('todo_is_created', addedTodo)
  }
  await findSharedLists('listId', addedTodo.listId).then((res) => {
    if (res) {
      const listSharedUsers = res.map((sharedList) => sharedList.userId)
      listSharedUsers.map((userId) => {
        if (socketsMap.has(userId)) {
          const sockets = socketsMap.get(userId)
          for (const socketId of sockets) {
            io.to(socketId).emit('todo_is_created', addedTodo)
          }
        }
      })
    }
  })
}

export const socketDeleteTodo = async (
  todoId: string,
  userId: string,
  listId: string
): Promise<void> => {
  const socketsId = socketsMap.get(userId)
  for (const socketId of socketsId) {
    io.to(socketId).emit('todo_is_deleted', todoId)
  }
  await findSharedLists('listId', listId).then((res) => {
    if (res) {
      const listSharedUsers = res.map((sharedList) => sharedList.userId)
      listSharedUsers.map((userId) => {
        if (socketsMap.has(userId)) {
          const sockets = socketsMap.get(userId)
          for (const socketId of sockets) {
            io.to(socketId).emit('todo_is_deleted', todoId)
          }
        }
      })
    }
  })
}

export const socketEditTodo = async (
  editedTodo: Todo,
  userId: string
): Promise<void> => {
  const socketsId = socketsMap.get(userId)
  for (const socketId of socketsId) {
    io.to(socketId).emit('todo_is_edited', editedTodo)
  }
  await findSharedLists('listId', editedTodo.listId).then((res) => {
    if (res) {
      const listSharedUsers = res.map((sharedList) => sharedList.userId)
      listSharedUsers.map((userId) => {
        if (socketsMap.has(userId)) {
          const sockets = socketsMap.get(userId)
          for (const socketId of sockets) {
            io.to(socketId).emit('todo_is_edited', editedTodo)
          }
        }
      })
    }
  })
}

export const socketClearComplete = async (
  listId: string,
  userId: string
): Promise<void> => {
  const socketsId = socketsMap.get(userId)
  for (const socketId of socketsId) {
    io.to(socketId).emit('done_todos_is_cleared', listId)
  }
  await findSharedLists('listId', listId).then((res) => {
    if (res) {
      const listSharedUsers = res.map((sharedList) => sharedList.userId)
      listSharedUsers.map((userId) => {
        if (socketsMap.has(userId)) {
          const sockets = socketsMap.get(userId)
          for (const socketId of sockets) {
            io.to(socketId).emit('done_todos_is_cleared', listId)
          }
        }
      })
    }
  })
}

export { socketsMap }
