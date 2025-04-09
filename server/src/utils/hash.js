const bcrypt = require('bcrypt')

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plainPassword, salt)
}

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword)
}

module.exports = {
  hashPassword,
  comparePassword
}
