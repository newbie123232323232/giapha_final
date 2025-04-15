const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupChat = sequelize.define('GroupChat', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TenNhom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MoTa: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ID_ThanhVien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ThanhVien',
      key: 'ID'
    }
  },
  NgayTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  TrangThai: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'NhomChat',
  timestamps: false
});

module.exports = GroupChat; 