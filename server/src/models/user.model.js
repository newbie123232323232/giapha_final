const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize.config') // <- đổi lại chỗ này

const User = sequelize.define('NguoiDung', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  HoTen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  MatKhau: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NgaySinh: DataTypes.DATE,
  GioiTinh: DataTypes.STRING,
  Avatar: DataTypes.STRING,
  VaiTro: {
    type: DataTypes.STRING,
    defaultValue: 'User',
  },
}, {
  tableName: 'NguoiDung',
  timestamps: false,
})

module.exports = User
