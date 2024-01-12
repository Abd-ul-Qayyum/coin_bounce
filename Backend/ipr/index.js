import express from 'express'
import mongoose, { Schema } from 'mongoose'
import cookieParser from 'cookie-parser'
import fs from 'fs'
// import { BACKEND_SERVER_PATH } from '../config/index.js'
import {
  PORT,
  CONNECTION,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
} from '../config/index.js'
import dbConnect from '../database/index.js'
import authController from '../controller/authController.js'
import auth from '../middlewares/auth.js'
import blogController from '../controller/blogController.js'
import commentController from '../controller/commentController.js'
import router from '../routes/index.js'
import Joi from 'joi'
import errorHandler from '../middlewares/errorHandler.js'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import Comment from '../models/comment.js'
import Blog from '../models/blog.js'
import RefreshToken from '../models/token.js'
import jwt from 'jsonwebtoken'
import UserDto from '../dto/user.js'
import BlogDto from '../dto/blog.js'
import BlogDetailsDto from '../dto/blogDetailsDto.js'
import CommentDto from '../dto/commentDto.js'
import JWTService from '../services/JWTService.js'
export {
  express,
  cookieParser,
  fs,
  BACKEND_SERVER_PATH,
  PORT,
  Schema,
  mongoose,
  CONNECTION,
  dbConnect,
  auth,
  router,
  Joi,
  bcrypt,
  UserDto,
  BlogDto,
  BlogDetailsDto,
  CommentDto,
  errorHandler,
  User,
  Comment,
  Blog,
  RefreshToken,
  jwt,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  JWTService,
  authController,
  blogController,
  commentController,
}
