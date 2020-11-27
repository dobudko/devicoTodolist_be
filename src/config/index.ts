import * as dotenv from 'dotenv'
dotenv.config()

const config = {
  token: process.env.TOKEN,
  saltRounds: process.env.SALT_ROUNDS,
}

export default config
