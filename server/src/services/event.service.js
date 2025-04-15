const { Event, FamilyMember, FamilyTree, ThanhVien } = require('../models');
const { Op } = require('sequelize');

// Service cho sự kiện
class EventService {
  // Lấy tất cả sự kiện của một cây gia phả
  async getEventsByFamilyTree(treeId, userId) {
    try {
      // Kiểm tra quyền truy cập vào cây gia phả
      const tree = await FamilyTree.findOne({
        where: { 
          idCayGiaPha: treeId,
          nguoiTao: userId
        }
      });
      
      if (!tree) {
        throw new Error('Không tìm thấy cây gia phả');
      }
      
      // Lấy tất cả thành viên trong cây gia phả
      const members = await FamilyMember.findAll({
        where: { idCayGiaPha: treeId }
      });
      
      const memberIds = members.map(member => member.idThanhVien);
      
      // Nếu không có thành viên nào
      if (memberIds.length === 0) {
        return [];
      }
      
      // Lấy tất cả sự kiện của các thành viên trong cây
      const events = await Event.findAll({
        where: {
          ID_ThanhVien: {
            [Op.in]: memberIds
          }
        },
        include: [{
          model: FamilyMember,
          as: 'ThanhVien',
          attributes: ['idThanhVien', 'ten', 'gioiTinh']
        }],
        order: [['NgayToChuc', 'ASC']]
      });
      
      return events;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện:', error);
      throw error;
    }
  }

  // Lấy chi tiết sự kiện
  async getEventById(eventId, userId) {
    try {
      const event = await Event.findByPk(eventId, {
        include: [{
          model: FamilyMember,
          as: 'ThanhVien',
          include: [{
            model: FamilyTree,
            attributes: ['idCayGiaPha', 'nguoiTao'],
            where: { nguoiTao: userId }
          }]
        }]
      });
      
      if (!event) {
        throw new Error('Không tìm thấy sự kiện');
      }
      
      return event;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sự kiện:', error);
      throw error;
    }
  }

  // Tạo sự kiện mới
  async createEvent(eventData, userId) {
    try {
      const { TenSuKien, NgayToChuc, MoTa, ID_ThanhVien } = eventData;
      
      // Kiểm tra thành viên tồn tại và thuộc về cây gia phả của người dùng
      const member = await FamilyMember.findOne({
        where: { idThanhVien: ID_ThanhVien },
        include: [{
          model: FamilyTree,
          where: { nguoiTao: userId }
        }]
      });
      
      if (!member) {
        throw new Error('Không tìm thấy thành viên hoặc bạn không có quyền truy cập');
      }
      
      // Kiểm tra ngày tổ chức phải là tương lai
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(NgayToChuc);
      eventDate.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        throw new Error('Ngày tổ chức phải sau ngày hiện tại');
      }
      
      // Tạo sự kiện mới
      const newEvent = await Event.create({
        TenSuKien,
        NgayToChuc,
        MoTa,
        ID_ThanhVien
      });
      
      return newEvent;
    } catch (error) {
      console.error('Lỗi khi tạo sự kiện:', error);
      throw error;
    }
  }

  // Cập nhật sự kiện
  async updateEvent(eventId, eventData, userId) {
    try {
      const { TenSuKien, NgayToChuc, MoTa, ID_ThanhVien } = eventData;
      
      // Tìm sự kiện và kiểm tra quyền truy cập
      const event = await Event.findOne({
        where: { ID: eventId },
        include: [{
          model: FamilyMember,
          as: 'ThanhVien',
          include: [{
            model: FamilyTree,
            where: { nguoiTao: userId }
          }]
        }]
      });
      
      if (!event) {
        throw new Error('Không tìm thấy sự kiện hoặc bạn không có quyền truy cập');
      }
      
      // Nếu có thay đổi thành viên, kiểm tra thành viên mới
      if (ID_ThanhVien && ID_ThanhVien !== event.ID_ThanhVien) {
        const member = await FamilyMember.findOne({
          where: { idThanhVien: ID_ThanhVien },
          include: [{
            model: FamilyTree,
            where: { nguoiTao: userId }
          }]
        });
        
        if (!member) {
          throw new Error('Không tìm thấy thành viên hoặc bạn không có quyền truy cập');
        }
      }
      
      // Nếu có thay đổi ngày tổ chức, kiểm tra phải là tương lai
      if (NgayToChuc) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(NgayToChuc);
        eventDate.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
          throw new Error('Ngày tổ chức phải sau ngày hiện tại');
        }
      }
      
      // Cập nhật sự kiện
      await event.update({
        TenSuKien: TenSuKien || event.TenSuKien,
        NgayToChuc: NgayToChuc || event.NgayToChuc,
        MoTa: MoTa !== undefined ? MoTa : event.MoTa,
        ID_ThanhVien: ID_ThanhVien || event.ID_ThanhVien
      });
      
      return event;
    } catch (error) {
      console.error('Lỗi khi cập nhật sự kiện:', error);
      throw error;
    }
  }

  // Xóa sự kiện
  async deleteEvent(eventId, userId) {
    try {
      // Tìm sự kiện và kiểm tra quyền truy cập
      const event = await Event.findOne({
        where: { ID: eventId },
        include: [{
          model: FamilyMember,
          as: 'ThanhVien',
          include: [{
            model: FamilyTree,
            where: { nguoiTao: userId }
          }]
        }]
      });
      
      if (!event) {
        throw new Error('Không tìm thấy sự kiện hoặc bạn không có quyền truy cập');
      }
      
      // Xóa sự kiện
      await event.destroy();
      
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa sự kiện:', error);
      throw error;
    }
  }

  // Lấy các sự kiện sắp tới
  async getUpcomingEvents(userId, days = 30) {
    try {
      // Tính toán ngày hiện tại và ngày giới hạn
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const limitDate = new Date();
      limitDate.setDate(today.getDate() + parseInt(days));
      limitDate.setHours(23, 59, 59, 999);
      
      // Lấy tất cả cây gia phả của người dùng
      const trees = await FamilyTree.findAll({
        where: { nguoiTao: userId }
      });
      
      if (trees.length === 0) {
        return [];
      }
      
      const treeIds = trees.map(tree => tree.idCayGiaPha);
      
      // Lấy tất cả thành viên trong các cây gia phả
      const members = await FamilyMember.findAll({
        where: { 
          idCayGiaPha: {
            [Op.in]: treeIds
          }
        }
      });
      
      if (members.length === 0) {
        return [];
      }
      
      const memberIds = members.map(member => member.idThanhVien);
      
      // Lấy các sự kiện sắp tới
      const events = await Event.findAll({
        where: {
          ID_ThanhVien: {
            [Op.in]: memberIds
          },
          NgayToChuc: {
            [Op.between]: [today, limitDate]
          }
        },
        include: [{
          model: FamilyMember,
          as: 'ThanhVien',
          attributes: ['idThanhVien', 'ten', 'gioiTinh']
        }],
        order: [['NgayToChuc', 'ASC']]
      });
      
      return events;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sự kiện sắp tới:', error);
      throw error;
    }
  }

  async getEvents() {
    return await Event.findAll({
      include: [{
        model: ThanhVien,
        attributes: ['Ten']
      }],
      order: [['NgayToChuc', 'DESC']]
    });
  }

  async getEventById(id) {
    return await Event.findByPk(id, {
      include: [{
        model: ThanhVien,
        attributes: ['Ten']
      }]
    });
  }

  async updateEvent(id, data) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error('Event not found');
    return await event.update(data);
  }

  async deleteEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error('Event not found');
    return await event.destroy();
  }

  async getUpcomingEvents(days = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return await Event.findAll({
      where: {
        NgayToChuc: {
          [Op.between]: [today, futureDate]
        }
      },
      include: [{
        model: ThanhVien,
        attributes: ['Ten']
      }],
      order: [['NgayToChuc', 'ASC']]
    });
  }
}

module.exports = new EventService(); 