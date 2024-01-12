import {
  BACKEND_SERVER_PATH,
  Blog,
  Joi,
  fs,
  BlogDto,
  BlogDetailsDto,
  Comment,
} from '../ipr/index.js'
import bufferPhoto from '../reusable/photoBuffer.js'

const mongoDbIdPattern = /^[0-9a-fA-F]{24}$/

const blogController = {
  async create(req, res, next) {
    // validate req body
    const blogValidationSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongoDbIdPattern).required(),
      photo: Joi.string().required(),
      content: Joi.string().required(),
    })
    const error = blogValidationSchema.validate(req.body).error
    if (error) {
      return next(error)
    }

    const { photo, author, title, content } = req.body

    const imagePath = bufferPhoto(photo, author)

    // save blog in db
    let newBlog
    try {
      newBlog = new Blog({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      })
      await newBlog.save()
    } catch (error) {
      return next(error)
    }
    const blogDto = new BlogDto(newBlog)
    // return response
    return res.status(201).json({ blog: blogDto })
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({})
      const blogsDto = []

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDto(blogs[i])
        blogsDto.push(dto)
        // console.log(blogsDto)
      }
      return res.status(200).json({ blogs: blogsDto })
    } catch (error) {
      return next(error)
    }
  },
  async getById(req, res, next) {
    // id vallidation
    const idvalidationSchema = Joi.object({
      id: Joi.string().regex(mongoDbIdPattern).required(),
    })

    const { error } = idvalidationSchema.validate(req.params)
    if (error) {
      return next(error)
    }
    const { id } = req.params
    let blog
    try {
      blog = await Blog.findOne({ _id: id }).populate('author')
    } catch (error) {
      return next(error)
    }
    // console.log(blog.createdAt)
    const blogDetailsDto = new BlogDetailsDto(blog)
    console.log(blogDetailsDto.createdAt)
    // return response
    return res.status(200).json({ blog: blogDetailsDto })
  },
  async update(req, res, next) {
    // validate update data
    const updateBlogValidation = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      author: Joi.string().regex(mongoDbIdPattern).required(),
      blogId: Joi.string().regex(mongoDbIdPattern).required(),
      photo: Joi.string(),
    })
    const { error } = updateBlogValidation.validate(req.body)

    const { title, content, author, blogId, photo } = req.body
    // delete previous photo if updated
    let blog
    try {
      blog = await Blog.findOne({ _id: blogId })
      console.log(blog)
    } catch (error) {
      return next(error)
    }
    if (photo) {
      let previousPhoto = blog.photoPath

      previousPhoto = previousPhoto.split(`/`).at(-1)

      // delete photo
      fs.unlinkSync(`storage/${previousPhoto}`)
      //   add new photo
      const imagePath = bufferPhoto(photo, author)
      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          photoPath: `${BACKEND_SERVER_PATH}/storrage/${imagePath}`,
        }
      )
    } else {
      await Blog.updateOne({ _id: blogId }, { title, content })
    }
    // return response
    return res.status(200).json({ message: 'Blog Updated Successfully' })
  },
  async delete(req, res, next) {
    // validate id
    const idvalidationSchema = Joi.object({
      id: Joi.string().regex(mongoDbIdPattern).required(),
    })
    const { error } = idvalidationSchema.validate(req.params)
    if (error) {
      return next(error)
    }
    const { id } = req.params
    // delete blog
    try {
      await Blog.deleteOne({ _id: id })
      // delete comments
      await Comment.deleteMany({ blog: id })
    } catch (error) {
      return next(error)
    }
    // return response
    return res.status(200).json({ message: 'Deleted SuccessFully' })
  },
}

export default blogController
