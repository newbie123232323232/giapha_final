const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  NoiDung: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ID_NhomChat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'NhomChat',
      key: 'ID'
    }
  },
  ID_ThanhVien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ThanhVien',
      key: 'ID'
    }
  },
  NgayGui: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  TrangThai: {
    type: DataTypes.ENUM('sent', 'delivered', 'read'),
    defaultValue: 'sent'
  }
}, {
  tableName: 'TinNhan',
  timestamps: false
});

module.exports = ChatMessage; 