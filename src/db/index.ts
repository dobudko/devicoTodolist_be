import * as mongoose from 'mongoose'

const url = 'mongodb://localhost:27017'
const dbName = 'todolist'

function connectToMongoDbMongoose() {
  try {
    mongoose.connect(`${url}/${dbName}`, {
      useNewUrlParser: true,
    })
    return mongoose
  } catch (err) {
    console.log(err)
  }
}

connectToMongoDbMongoose()
export default mongoose
