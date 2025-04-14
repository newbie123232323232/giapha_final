const eventService = require('../services/event.service');

// Lấy tất cả sự kiện của một gia phả
const getEventsByFamilyTree = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId } = req.params;
    
    const events = await eventService.getEventsByFamilyTree(treeId, userId);
    res.status(200).json(events);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện:', error);
    if (error.message === 'Không tìm thấy cây gia phả') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
  }
};

// Lấy sự kiện theo ID
const getEventById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    
    const event = await eventService.getEventById(eventId, userId);
    res.status(200).json(event);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sự kiện:', error);
    if (error.message === 'Không tìm thấy sự kiện') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
  }
};

// Tạo sự kiện mới
const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { TenSuKien, NgayToChuc, MoTa, ID_ThanhVien } = req.body;
    
    const newEvent = await eventService.createEvent({ 
      TenSuKien, NgayToChuc, MoTa, ID_ThanhVien 
    }, userId);
    
    res.status(201).json({
      message: 'Tạo sự kiện thành công.',
      event: newEvent
    });
  } catch (error) {
    console.error('Lỗi khi tạo sự kiện:', error);
    
    if (error.message.includes('Không tìm thấy thành viên')) {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('Ngày tổ chức')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ.',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo sự kiện.' });
  }
};

// Cập nhật sự kiện
const updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    const { TenSuKien, NgayToChuc, MoTa, ID_ThanhVien } = req.body;
    
    const event = await eventService.updateEvent(eventId, { 
      TenSuKien, NgayToChuc, MoTa, ID_ThanhVien 
    }, userId);
    
    res.status(200).json({
      message: 'Cập nhật sự kiện thành công.',
      event: event
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật sự kiện:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('Ngày tổ chức')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ.',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sự kiện.' });
  }
};

// Xóa sự kiện
const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;
    
    await eventService.deleteEvent(eventId, userId);
    
    res.status(200).json({ message: 'Xóa sự kiện thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa sự kiện:', error);
    
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sự kiện.' });
  }
};

// Lấy các sự kiện sắp tới
const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days } = req.query;
    
    const events = await eventService.getUpcomingEvents(userId, days);
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sự kiện sắp tới:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
  }
};

module.exports = {
  getEventsByFamilyTree,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
}; 