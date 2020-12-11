import Context from '../types/Context'

const makeResponse = (ctx: Context, next: any): any => {
  ctx.ok = (body = {}) => {
    ctx.response.status = 200
    ctx.response.body = body
  }

  return next()
}

export default makeResponse
