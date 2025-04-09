const { body, validationResult } = require('express-validator');

// Middleware kiểm tra kết quả validate
const validate = (req, res, next) => {
    console.log('✅ Body nhận:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Lỗi validate:', errors.array());
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Validate đăng ký
const validateRegister = [
  body('HoTen').notEmpty().withMessage('Họ tên không được để trống'),
  body('Email').isEmail().withMessage('Email không hợp lệ'),
  body('MatKhau').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('NgaySinh').optional().isDate().withMessage('Ngày sinh không hợp lệ'),
  body('GioiTinh').optional().isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ'),
  validate
];

// Validate đăng nhập
const validateLogin = [
  body('Email').isEmail().withMessage('Email không hợp lệ'),
  body('MatKhau').notEmpty().withMessage('Mật khẩu không được để trống'),
  validate
];

// Validate đổi mật khẩu
const validateChangePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Mật khẩu cũ không được để trống'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  body('HoTen')
    .optional()
    .notEmpty()
    .withMessage('Họ tên không được để trống'),
  body('Email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('NgaySinh')
    .optional()
    .isDate()
    .withMessage('Ngày sinh không hợp lệ'),
  body('GioiTinh')
    .optional()
    .isIn(['Nam', 'Nữ', 'Khác'])
    .withMessage('Giới tính không hợp lệ'),
  body('Avatar')
    .optional()
    .isURL()
    .withMessage('Avatar phải là một URL hợp lệ'),
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword
};
