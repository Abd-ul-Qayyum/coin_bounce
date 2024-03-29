// import { ValidationError } from '../ipr/index.js'
import * as Joi from 'joi'

const errorHandler = (error, req, res, next) => {
  let status = 500
  let data = {
    message: 'Internal Server Error',
  }

  if (error.isJoi) {
    status = 401
    data.message = error.message

    return res.status(status).json(data)
  }
  if (error.status) {
    status = error.status
  }
  if (error.message) {
    data.message = error.message
  }

  return res.status(status).json(data)
}

export default errorHandler
