const express = require('express');
const router = express.Router();

const { familyTreeController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  validateCreateTree,
  validateUpdateTree,
  validateAddMember,
  validateUpdateMember,
  validateSpouseRelation
} = require('../middlewares/validate.middleware');

// Lấy danh sách cây gia phả của người dùng
router.get('/', authMiddleware, familyTreeController.getTreesByUser);

// Tạo cây gia phả mới
router.post('/', authMiddleware, validateCreateTree, familyTreeController.createTree);

// Lấy chi tiết một cây gia phả
router.get('/:treeId', authMiddleware, familyTreeController.getTreeById);

// Cập nhật thông tin cây gia phả
router.put('/:treeId', authMiddleware, validateUpdateTree, familyTreeController.updateTree);

// Xóa cây gia phả
router.delete('/:treeId', authMiddleware, familyTreeController.deleteTree);

// Thêm thành viên vào cây gia phả
router.post('/:treeId/members', authMiddleware, validateAddMember, familyTreeController.addMember);

// Cập nhật thông tin thành viên
router.put('/:treeId/members/:memberId', authMiddleware, validateUpdateMember, familyTreeController.updateMember);

// Xóa thành viên
router.delete('/:treeId/members/:memberId', authMiddleware, familyTreeController.deleteMember);

// Thêm mối quan hệ vợ chồng
router.post('/:treeId/members/:memberId/spouse', authMiddleware, validateSpouseRelation, familyTreeController.addSpouseRelation);

module.exports = router; 