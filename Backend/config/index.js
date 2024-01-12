import dotenv from 'dotenv'
dotenv.config()

// const PORT = process.env.PORT
// const CONNECTION = process.env.CONNECTION
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

// above and below have same meaning

const {
  PORT,
  CONNECTION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
} = process.env

export {
  PORT,
  CONNECTION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
}
