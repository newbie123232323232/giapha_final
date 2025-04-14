const express = require('express');
const router = express.Router();

const { eventController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

// Lấy các sự kiện sắp tới trong thời gian cụ thể (mặc định 30 ngày)
router.get('/upcoming', authMiddleware, eventController.getUpcomingEvents);

// Lấy tất cả sự kiện của một cây gia phả
router.get('/tree/:treeId', authMiddleware, eventController.getEventsByFamilyTree);

// Lấy chi tiết sự kiện
router.get('/:eventId', authMiddleware, eventController.getEventById);

// Tạo sự kiện mới
router.post('/', authMiddleware, eventController.createEvent);

// Cập nhật sự kiện
router.put('/:eventId', authMiddleware, eventController.updateEvent);

// Xóa sự kiện
router.delete('/:eventId', authMiddleware, eventController.deleteEvent);

module.exports = router; 