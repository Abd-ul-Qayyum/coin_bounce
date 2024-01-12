import { mongoose, CONNECTION } from '../ipr/index.js'

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(CONNECTION)
    console.log('database is connected to ' + conn.connection.host)
  } catch (error) {
    console.log(error)
  }
}

export default dbConnect
