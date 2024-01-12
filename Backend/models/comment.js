import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    blogId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Blog' },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.model('Comment', commentSchema, 'comments')
