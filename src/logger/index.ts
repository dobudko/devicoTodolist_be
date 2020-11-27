async function logger(ctx: any, next: any): Promise<void> {
  const start = Date.now()
  try {
    await next()
  } catch (err) {
    console.log(err)
  }
  console.log(
    ctx.method,
    ctx.originalUrl,
    ctx.status,
    '-',
    Date.now() - start,
    'ms'
  )
}

export default logger
