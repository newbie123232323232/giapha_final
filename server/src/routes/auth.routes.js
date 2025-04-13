const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const {
  validateRegister,
  validateLogin,
  validateChangePassword
} = require('../middlewares/validate.middleware');

// Đăng ký
router.post('/register', validateRegister, authController.register);

// Đăng nhập
router.post('/login', validateLogin, authController.login);

// Đổi mật khẩu (cần đăng nhập)
router.put('/change-password', authMiddleware, validateChangePassword, authController.changePassword);

// Cập nhật thông tin cá nhân
router.put('/update-profile', authMiddleware, authController.updateProfile);

// Xóa tài khoản
router.delete('/delete-account', authMiddleware, authController.deleteAccount);

//Lấy thông tin người dùng hiện tại
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
