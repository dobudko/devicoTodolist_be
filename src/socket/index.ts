import { io } from '../../index'
import Todo from '../types/Todo'
import { findMany as findSharedLists } from '../models/sharedLists'
import { findMany } from '../models/sockets'

export const socketAddTodo = async (
  addedTodo: Todo,
  userId: string
): Promise<void> => {
  await findMany('userId', userId).then((sockets) => {
    const socketsId = sockets.map((socket) => socket.socketId)
    for (const socketId of socketsId) {
      io.to(socketId).emit('todo_is_created', addedTodo)
    }
  })
  let listSharedUsers
  await findSharedLists('listId', addedTodo.listId).then((res) => {
    if (res) {
      listSharedUsers = res.map((sharedList) => sharedList.userId)
    }
  })
  if (listSharedUsers) {
    await listSharedUsers.map(async (userId) => {
      await findMany('userId', userId).then((sockets) => {
        if (sockets) {
          const socketsId = sockets.map((socket) => socket.socketId)
          for (const socketId of socketsId) {
            io.to(socketId).emit('todo_is_created', addedTodo)
          }
        }
      })
    })
  }
}

export const socketDeleteTodo = async (
  todoId: string,
  userId: string,
  listId: string
): Promise<void> => {
  await findMany('userId', userId).then((sockets) => {
    const socketsId = sockets.map((socket) => socket.socketId)
    for (const socketId of socketsId) {
      io.to(socketId).emit('todo_is_deleted', todoId)
    }
  })

  let listSharedUsers
  await findSharedLists('listId', listId).then((res) => {
    if (res) {
      listSharedUsers = res.map((sharedList) => sharedList.userId)
    }
  })
  if (listSharedUsers) {
    await listSharedUsers.map(async (userId) => {
      await findMany('userId', userId).then((sockets) => {
        if (sockets) {
          const socketsId = sockets.map((socket) => socket.socketId)
          for (const socketId of socketsId) {
            io.to(socketId).emit('todo_is_deleted', todoId)
          }
        }
      })
    })
  }
}

export const socketEditTodo = async (
  editedTodo: Todo,
  userId: string
): Promise<void> => {
  await findMany('userId', userId).then((sockets) => {
    const socketsId = sockets.map((socket) => socket.socketId)
    for (const socketId of socketsId) {
      io.to(socketId).emit('todo_is_edited', editedTodo)
    }
  })

  let listSharedUsers
  await findSharedLists('listId', editedTodo.listId).then((res) => {
    if (res) {
      listSharedUsers = res.map((sharedList) => sharedList.userId)
    }
  })
  if (listSharedUsers) {
    await listSharedUsers.map(async (userId) => {
      await findMany('userId', userId).then((sockets) => {
        if (sockets) {
          const socketsId = sockets.map((socket) => socket.socketId)
          for (const socketId of socketsId) {
            io.to(socketId).emit('todo_is_edited', editedTodo)
          }
        }
      })
    })
  }
}

export const socketClearComplete = async (
  listId: string,
  userId: string
): Promise<void> => {
  await findMany('userId', userId).then((sockets) => {
    const socketsId = sockets.map((socket) => socket.socketId)
    for (const socketId of socketsId) {
      io.to(socketId).emit('done_todos_is_cleared', listId)
    }
  })

  let listSharedUsers
  await findSharedLists('listId', listId).then((res) => {
    if (res) {
      listSharedUsers = res.map((sharedList) => sharedList.userId)
    }
  })
  if (listSharedUsers) {
    await listSharedUsers.map(async (userId) => {
      await findMany('userId', userId).then((sockets) => {
        if (sockets) {
          const socketsId = sockets.map((socket) => socket.socketId)
          for (const socketId of socketsId) {
            io.to(socketId).emit('done_todos_is_cleared', listId)
          }
        }
      })
    })
  }
}
