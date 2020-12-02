import { Context as C } from 'koa'

type Context = C & { request: any }

export default Context
