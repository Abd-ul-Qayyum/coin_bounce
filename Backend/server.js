import {
  PORT,
  cookieParser,
  dbConnect,
  errorHandler,
  express,
  router,
} from './ipr/index.js'

const app = express()
app.use(cookieParser())
app.use(express.json())

dbConnect()
app.use(router)

app.use('/storage', express.static('storage'))
app.use(errorHandler)

app.listen(PORT, console.log('serve is running on port:' + PORT))
