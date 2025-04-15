const express = require('express');
const router = express.Router();
const { groupChatController } = require('../controllers');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Tạo nhóm chat mới
router.post('/', authenticateToken, groupChatController.createGroup);

// Lấy danh sách nhóm chat
router.get('/', authenticateToken, groupChatController.getGroups);

// Lấy thông tin chi tiết nhóm chat
router.get('/:id', authenticateToken, groupChatController.getGroupById);

// Cập nhật thông tin nhóm chat
router.put('/:id', authenticateToken, groupChatController.updateGroup);

// Xóa nhóm chat
router.delete('/:id', authenticateToken, groupChatController.deleteGroup);

// Gửi tin nhắn
router.post('/:groupId/messages', authenticateToken, groupChatController.sendMessage);

// Lấy tin nhắn của nhóm
router.get('/:groupId/messages', authenticateToken, groupChatController.getMessages);

module.exports = router; 