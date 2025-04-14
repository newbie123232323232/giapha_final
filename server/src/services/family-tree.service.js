const { FamilyTree, FamilyMember } = require('../models');
const { Op } = require('sequelize');

// Service cho cây gia phả
class FamilyTreeService {
  // Lấy tất cả cây gia phả của người dùng
  async getUserTrees(userId) {
    try {
      return await FamilyTree.findAll({
        where: { nguoiTao: userId },
        order: [['ngayCapNhat', 'DESC']]
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cây gia phả:', error);
      throw new Error('Không thể lấy danh sách cây gia phả');
    }
  }

  // Lấy chi tiết một cây gia phả với thành viên
  async getTreeDetails(treeId, userId) {
    try {
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        },
        include: [
          {
            model: FamilyMember,
            as: 'members',
            required: false
          }
        ]
      });

      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }

      // Xây dựng cây phả hệ từ danh sách thành viên
      return this.buildFamilyTree(tree);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết cây gia phả:', error);
      throw error;
    }
  }

  // Xây dựng cấu trúc cây từ danh sách thành viên phẳng
  buildFamilyTree(tree) {
    const treeData = tree.toJSON();
    const members = treeData.members || [];
    
    // Tạo map để dễ dàng tìm kiếm thành viên theo ID
    const membersMap = {};
    members.forEach(member => {
      membersMap[member.idThanhVien] = {
        ...member,
        children: []
      };
    });
    
    // Danh sách thành viên gốc (không có cha)
    const rootMembers = [];
    
    // Xây dựng cấu trúc cây
    members.forEach(member => {
      // Nếu thành viên có cha
      if (member.idCha && membersMap[member.idCha]) {
        membersMap[member.idCha].children.push(membersMap[member.idThanhVien]);
      } 
      // Nếu không có cha (thành viên gốc)
      else {
        rootMembers.push(membersMap[member.idThanhVien]);
      }
      
      // Xử lý quan hệ vợ chồng
      if (member.idVoChong && membersMap[member.idVoChong]) {
        membersMap[member.idThanhVien].spouse = membersMap[member.idVoChong];
      }
    });
    
    // Trả về cây đã được xây dựng
    return {
      ...treeData,
      members: rootMembers
    };
  }

  // Tạo cây gia phả mới
  async createTree(treeData, userId) {
    try {
      return await FamilyTree.create({
        ...treeData,
        nguoiTao: userId,
        ngayTao: new Date(),
        ngayCapNhat: new Date()
      });
    } catch (error) {
      console.error('Lỗi khi tạo cây gia phả:', error);
      throw new Error('Không thể tạo cây gia phả');
    }
  }

  // Cập nhật cây gia phả
  async updateTree(treeId, treeData, userId) {
    try {
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      return await tree.update({
        ...treeData,
        ngayCapNhat: new Date()
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật cây gia phả:', error);
      throw error;
    }
  }

  // Xóa cây gia phả
  async deleteTree(treeId, userId) {
    try {
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      // Xóa tất cả thành viên trong cây
      await FamilyMember.destroy({
        where: { idCayGiaPha: treeId }
      });
      
      // Xóa cây
      return await tree.destroy();
    } catch (error) {
      console.error('Lỗi khi xóa cây gia phả:', error);
      throw error;
    }
  }

  // Thêm thành viên
  async addMember(treeId, memberData, userId) {
    try {
      // Kiểm tra cây tồn tại và thuộc về người dùng
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      // Tạo thành viên mới
      const newMember = await FamilyMember.create({
        ...memberData,
        idCayGiaPha: treeId
      });
      
      // Cập nhật ngày cập nhật của cây
      await tree.update({ ngayCapNhat: new Date() });
      
      return newMember;
    } catch (error) {
      console.error('Lỗi khi thêm thành viên:', error);
      throw error;
    }
  }

  // Cập nhật thành viên
  async updateMember(treeId, memberId, memberData, userId) {
    try {
      // Kiểm tra cây tồn tại và thuộc về người dùng
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      // Tìm thành viên
      const member = await FamilyMember.findOne({
        where: {
          idThanhVien: memberId,
          idCayGiaPha: treeId
        }
      });
      
      if (!member) {
        throw new Error('Không tìm thấy thành viên');
      }
      
      // Cập nhật thành viên
      await member.update(memberData);
      
      // Cập nhật ngày cập nhật của cây
      await tree.update({ ngayCapNhat: new Date() });
      
      return member;
    } catch (error) {
      console.error('Lỗi khi cập nhật thành viên:', error);
      throw error;
    }
  }

  // Xóa thành viên
  async deleteMember(treeId, memberId, userId) {
    try {
      // Kiểm tra cây tồn tại và thuộc về người dùng
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      // Tìm thành viên
      const member = await FamilyMember.findOne({
        where: {
          idThanhVien: memberId,
          idCayGiaPha: treeId
        }
      });
      
      if (!member) {
        throw new Error('Không tìm thấy thành viên');
      }
      
      // Kiểm tra xem thành viên có con không
      const childrenCount = await FamilyMember.count({
        where: {
          [Op.or]: [
            { idCha: memberId },
            { idMe: memberId }
          ],
          idCayGiaPha: treeId
        }
      });
      
      if (childrenCount > 0) {
        throw new Error('Thành viên có con, vui lòng xóa hoặc cập nhật quan hệ của con trước');
      }
      
      // Xóa thành viên
      await member.destroy();
      
      // Cập nhật ngày cập nhật của cây
      await tree.update({ ngayCapNhat: new Date() });
      
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa thành viên:', error);
      throw error;
    }
  }

  // Tạo mối quan hệ vợ chồng
  async createSpouseRelation(treeId, memberId, spouseId, userId) {
    try {
      // Kiểm tra cây tồn tại và thuộc về người dùng
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      // Tìm thành viên
      const member = await FamilyMember.findOne({
        where: {
          idThanhVien: memberId,
          idCayGiaPha: treeId
        }
      });
      
      const spouse = await FamilyMember.findOne({
        where: {
          idThanhVien: spouseId,
          idCayGiaPha: treeId
        }
      });
      
      if (!member || !spouse) {
        throw new Error('Không tìm thấy thành viên hoặc bạn đời');
      }
      
      // Tạo mối quan hệ vợ chồng
      await member.update({ idVoChong: spouseId });
      await spouse.update({ idVoChong: memberId });
      
      // Cập nhật ngày cập nhật của cây
      await tree.update({ ngayCapNhat: new Date() });
      
      return { member, spouse };
    } catch (error) {
      console.error('Lỗi khi tạo mối quan hệ vợ chồng:', error);
      throw error;
    }
  }
}

module.exports = new FamilyTreeService(); 