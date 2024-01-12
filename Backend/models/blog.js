import mongoose, { Schema } from 'mongoose'

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    photoPath: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default mongoose.model('Blog', blogSchema, 'blogs')
