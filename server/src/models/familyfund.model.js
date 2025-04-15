const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FamilyFund = sequelize.define('FamilyFund', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TenQuy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MoTa: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  SoTienMucTieu: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  SoTienHienTai: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  QRCode: {
    type: DataTypes.STRING,
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
  tableName: 'QuyGiaDinh',
  timestamps: false
});

module.exports = FamilyFund; 