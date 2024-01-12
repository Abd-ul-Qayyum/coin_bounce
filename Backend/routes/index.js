import {
  express,
  authController,
  auth,
  blogController,
  commentController,
} from '../ipr/index.js'
// import authController from '../controller/authController.js'
const router = express.Router()
router.get('/', (req, res) => res.send('Assalam o Alaikum'))
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', auth, authController.logout)
router.get('/refresh', authController.refresh)

// create blog
router.post('/blog', auth, blogController.create)

// get all
router.get('/blog/all', auth, blogController.getAll)

// get by id
router.get('/blog/:id', auth, blogController.getById)

// update blog
router.put('/blog', auth, blogController.update)

// delete blog
router.delete('/blog/:id', auth, blogController.delete)

// create comment
router.post('/comment', auth, commentController.create)
// get all comments
router.get('/comment/:id', auth, commentController.getById)

export default router
