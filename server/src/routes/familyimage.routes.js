const express = require('express');
const router = express.Router();
const { familyImageController, upload } = require('../controllers');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Tải lên ảnh mới
router.post('/', authenticateToken, upload.single('image'), familyImageController.uploadImage);

// Lấy danh sách ảnh
router.get('/', authenticateToken, familyImageController.getImages);

// Lấy ảnh theo gia phả
router.get('/family-tree/:treeId', authenticateToken, familyImageController.getImagesByFamilyTree);

// Lấy thông tin chi tiết ảnh
router.get('/:id', authenticateToken, familyImageController.getImageById);

// Cập nhật thông tin ảnh
router.put('/:id', authenticateToken, familyImageController.updateImage);

// Xóa ảnh
router.delete('/:id', authenticateToken, familyImageController.deleteImage);

module.exports = router; 