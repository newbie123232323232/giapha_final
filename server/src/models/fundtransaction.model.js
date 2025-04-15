const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FundTransaction = sequelize.define('FundTransaction', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SoTien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  LoaiGiaoDich: {
    type: DataTypes.ENUM('deposit', 'withdraw'),
    allowNull: false
  },
  ID_Quy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'QuyGiaDinh',
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
  NgayGiaoDich: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  MoTa: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'GiaoDichQuy',
  timestamps: false
});

module.exports = FundTransaction; 