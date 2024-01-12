import {
  JWTService,
  Joi,
  RefreshToken,
  User,
  UserDto,
  bcrypt,
} from '../ipr/index.js'

const PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const authController = {
  async register(req, res, next) {
    // creating joi object
    const userDataValidation = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().min(5).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(PATTERN).required(),
      confirmPassword: Joi.ref('password'),
    })
    // input validation
    const error = userDataValidation.validate(req.body).error
    // error handling
    if (error) {
      return next(error)
    }
    // getting data from body
    const { username, name, email, password } = req.body
    // database connection
    try {
      // if email or username already used
      const emailExists = await User.exists({ email })
      const usernameExists = await User.exists({ username })
      //   if email already registered
      if (emailExists) {
        const error = {
          status: 409,
          message: 'You are already registered please signIn',
        }

        return next(error)
      }
      //   if username already taking
      if (usernameExists) {
        const error = {
          status: 409,
          message: 'Username already taken please select new one',
        }

        return next(error)
      }
      //   database connection error handling
    } catch (error) {
      return next(error)
    }
    // password Hashing for security
    const hashedPassword = await bcrypt.hash(password, 10)
    let accessToken
    let refreshToken
    let user
    try {
      // creating new user in database
      const userToRegister = new User({
        username,
        name,
        email,
        password: hashedPassword,
      })
      //  saving new user in database
      user = await userToRegister.save()

      accessToken = JWTService.signAccessToken({ _id: user._id }, '30m')
      refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m')
    } catch (error) {
      return next(error)
    }

    // send tokens in cookies
    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true,
    })
    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true,
    })

    // store refresh token in database
    await JWTService.storeRefreshToken(refreshToken, user._id)

    // sending response if everything done well
    const userDto = new UserDto(user)
    return res.status(201).json({ user: userDto, auth: true })
  },

  async login(req, res, next) {
    const { username, password } = req.body
    let user
    try {
      user = await User.findOne({
        $or: [{ username: username }, { email: username }],
      })
      if (!user) {
        const error = {
          status: 401,
          message: 'Invalid username or email',
        }
        return next(error)
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        const error = {
          status: 401,
          message: 'Incorrect Password',
        }
        return next(error)
      }
    } catch (error) {
      return next(error)
    }
    const accessToken = JWTService.signAccessToken({ _id: user._id }, '30m')
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m')

    // update token
    try {
      await RefreshToken.updateOne(
        { _id: user._id },
        { token: refreshToken },
        { upsert: true }
      )
    } catch (error) {
      return next(error)
    }

    // send tokens to cookies
    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true,
    })
    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 3600 * 24,
      httpOnly: true,
    })

    const userDto = new UserDto(user)
    return res.status(200).json({ user: userDto, auth: true })
  },
  async logout(req, res, next) {
    //  req token from cookies
    const { refreshToken } = req.cookies

    // delete refresh token from database
    try {
      await RefreshToken.deleteOne({ token: refreshToken })
    } catch (error) {
      return next(error)
    }

    // delete cookies
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    // or
    // res.clearCookie('accessToken').clearCookie('refreshToken')

    return res.status(200).json({ user: null, auth: false })
  },
  async refresh(req, res, next) {
    // get refreshToken from cookies
    // verify refresh token
    // generate new token
    // update db and return response

    let refreshToken = req.cookies.refreshToken
    let _id
    try {
      _id = JWTService.verifyRefreshToken(refreshToken)
    } catch (error) {
      return next(error)
    }
    let matchT
    try {
      matchT = await RefreshToken.findOne({ _id: _id, token: refreshToken })
      if (!matchT) {
        const error = {
          staus: 401,
          message: 'Unauthorized',
        }
        return next(error)
      }
    } catch (error) {
      return next(error)
    }

    let accessToken
    try {
      accessToken = JWTService.signAccessToken({ _id: _id }, '30m')
      refreshToken = JWTService.signRefreshToken({ _id: _id }, '69m')
      await RefreshToken.updateOne({ _id: _id }, { token: refreshToken })

      res.cookie('accessToken', accessToken, {
        naxAge: 1000 * 3600 * 24,
        httpOnly: true,
      })
      res.cookie('refreshToken', refreshToken, {
        naxAge: 1000 * 3600 * 24,
        httpOnly: true,
      })
    } catch (error) {
      return next(error)
    }
    const user = await User.findOne({ _id: _id })
    const userDto = new UserDto(user)
    return res.status(200).json({ user: userDto, auth: true })
  },
}

export default authController
