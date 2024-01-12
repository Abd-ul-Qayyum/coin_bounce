import { Joi, Blog, Comment, CommentDto } from '../ipr/index.js'
const mongoDbIdPattern = /^[0-9a-fA-F]{24}$/

const commentController = {
  async create(req, res, next) {
    // validate input
    const commentValidateSchema = Joi.object({
      content: Joi.string().required(),
      author: Joi.string().regex(mongoDbIdPattern).required(),
      blogId: Joi.string().regex(mongoDbIdPattern).required(),
    })
    const { error } = commentValidateSchema.validate(req.body)
    if (error) {
      return next(error)
    }

    const { content, blogId, author } = req.body

    // save to database
    try {
      const newComment = new Comment({
        content,
        author,
        blogId,
      })
      await newComment.save()
    } catch (error) {
      return next(error)
    }
    // return response
    return res.status(201).json({ message: 'Comment created' })
  },
  async getById(req, res, next) {
    // validation schema
    const commentValidateSchema = Joi.object({
      id: Joi.string().regex(mongoDbIdPattern).required(),
    })
    const { error } = commentValidateSchema.validate(req.params)

    if (error) {
      return next(error)
    }
    const { id } = req.params
    let comment
    try {
      comment = await Comment.find({ blogId: id }).populate('author')
    } catch (error) {
      return next(error)
    }

    let commentDto = []
    for (let i = 0; i < comment.length; i++) {
      const dto = new CommentDto(comment[i])
      commentDto.push(dto)
    }
    return res.status(200).json({ data: commentDto })
  },
}

export default commentController
