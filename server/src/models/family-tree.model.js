const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize.config')
const User = require('./user.model')

// Model cho Cây gia phả
const FamilyTree = sequelize.define('CayGiaPha', {
  idCayGiaPha: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenCayGiaPha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moTa: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nguoiTao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'ID'
    }
  },
  ngayTao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ngayCapNhat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'CayGiaPha',
  timestamps: false,
})

// Model cho Thành viên trong cây gia phả
const FamilyMember = sequelize.define('ThanhVien', {
  idThanhVien: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idCayGiaPha: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FamilyTree,
      key: 'idCayGiaPha'
    }
  },
  ten: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ngaySinh: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  ngayMat: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gioiTinh: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nam'
  },
  moTa: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  anhDaiDien: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idCha: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ThanhVien',
      key: 'idThanhVien'
    }
  },
  idMe: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ThanhVien',
      key: 'idThanhVien'
    }
  },
  idVoChong: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'ThanhVien',
      key: 'idThanhVien'
    }
  }
}, {
  tableName: 'ThanhVien',
  timestamps: false
});

// Thiết lập mối quan hệ
FamilyTree.hasMany(FamilyMember, { as: 'members', foreignKey: 'idCayGiaPha' });
FamilyMember.belongsTo(FamilyTree, { foreignKey: 'idCayGiaPha' });

// Mối quan hệ tự tham chiếu cho cha-con
FamilyMember.hasMany(FamilyMember, { as: 'children', foreignKey: 'idCha' });
FamilyMember.belongsTo(FamilyMember, { as: 'father', foreignKey: 'idCha' });

// Mối quan hệ tự tham chiếu cho mẹ-con
FamilyMember.hasMany(FamilyMember, { as: 'motherChildren', foreignKey: 'idMe' });
FamilyMember.belongsTo(FamilyMember, { as: 'mother', foreignKey: 'idMe' });

// Mối quan hệ tự tham chiếu cho vợ-chồng
FamilyMember.belongsTo(FamilyMember, { as: 'spouse', foreignKey: 'idVoChong' });

module.exports = {
  FamilyTree,
  FamilyMember
}; 