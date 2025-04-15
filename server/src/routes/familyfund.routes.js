const express = require('express');
const router = express.Router();
const { familyFundController } = require('../controllers');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Tạo quỹ mới
router.post('/', authenticateToken, familyFundController.createFund);

// Lấy danh sách quỹ
router.get('/', authenticateToken, familyFundController.getFunds);

// Lấy thông tin chi tiết quỹ
router.get('/:id', authenticateToken, familyFundController.getFundById);

// Cập nhật thông tin quỹ
router.put('/:id', authenticateToken, familyFundController.updateFund);

// Xóa quỹ
router.delete('/:id', authenticateToken, familyFundController.deleteFund);

// Thêm giao dịch
router.post('/:fundId/transactions', authenticateToken, familyFundController.addTransaction);

// Lấy lịch sử giao dịch
router.get('/:fundId/transactions', authenticateToken, familyFundController.getTransactions);

module.exports = router; 