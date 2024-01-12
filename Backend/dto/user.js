class UserDto {
  constructor(user) {
    this._id = user._id
    this.name = user.name
    this.email = user.email
  }
}

export default UserDto
