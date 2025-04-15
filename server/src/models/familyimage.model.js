const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FamilyImage = sequelize.define('FamilyImage', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TenAnh: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MoTa: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  DuongDan: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ID_ThanhVien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ThanhVien',
      key: 'ID'
    }
  },
  ID_GiaPha: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'GiaPha',
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
  tableName: 'AnhGiaDinh',
  timestamps: false
});

module.exports = FamilyImage; 