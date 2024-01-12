import {
  jwt,
  RefreshToken,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../ipr/index.js'

class JWTService {
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime })
  }
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime })
  }
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
  }
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
  }
  static async storeRefreshToken(token, userId) {
    try {
      const refreshToken = new RefreshToken({
        token: token,
        userId: userId,
      })

      await refreshToken.save()
    } catch (error) {
      console.log(error)
    }
  }
}

export default JWTService
