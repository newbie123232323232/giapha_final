const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize.config')
const { FamilyMember } = require('./family-tree.model')

// Model cho sự kiện gia đình
const Event = sequelize.define('SuKien', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenSuKien: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  NgayToChuc: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isAfterToday(value) {
        if (new Date(value) < new Date()) {
          throw new Error('Ngày tổ chức phải sau ngày hiện tại');
        }
      }
    }
  },
  MoTa: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  ID_ThanhVien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FamilyMember,
      key: 'idThanhVien'
    }
  }
}, {
  tableName: 'SuKien',
  timestamps: false,
})

// Thiết lập mối quan hệ
Event.belongsTo(FamilyMember, { foreignKey: 'ID_ThanhVien', as: 'ThanhVien' });
FamilyMember.hasMany(Event, { foreignKey: 'ID_ThanhVien', as: 'SuKien' });

module.exports = Event; 