const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_DATABASE, // tên DB
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    dialectModule: require('tedious'),
    logging: false, // để true nếu muốn log SQL
  }
)

module.exports = sequelize
