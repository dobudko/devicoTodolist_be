const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'todolist'
let db

export async function connectToMongoDb() {
  try {
    const client = await MongoClient.connect(url)
    db = client.db(dbName)
    return client
  } catch (err) {
    console.log(err)
  }
}

export function getCollection(collection) {
  if (!db) {
    console.log('Db is not connected')
  } else {
    return db.collection(collection)
  }
}
