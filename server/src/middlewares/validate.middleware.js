const { body, param, validationResult } = require('express-validator');

// Xử lý lỗi validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation cho đăng ký
const validateRegister = [
  body('HoTen').notEmpty().withMessage('Họ tên không được để trống'),
  body('Email').isEmail().withMessage('Email không hợp lệ'),
  body('MatKhau').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  handleValidationErrors
];

// Validation cho đăng nhập
const validateLogin = [
  body('Email').isEmail().withMessage('Email không hợp lệ'),
  body('MatKhau').notEmpty().withMessage('Mật khẩu không được để trống'),
  handleValidationErrors
];

// Validation cho đổi mật khẩu
const validateChangePassword = [
  body('oldPassword').notEmpty().withMessage('Mật khẩu cũ không được để trống'),
  body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  handleValidationErrors
];

// Validation cho tạo cây gia phả mới
const validateCreateTree = [
  body('tenCayGiaPha').notEmpty().withMessage('Tên cây gia phả không được để trống'),
  handleValidationErrors
];

// Validation cho cập nhật cây gia phả
const validateUpdateTree = [
  param('treeId').isInt().withMessage('ID cây gia phả không hợp lệ'),
  body('tenCayGiaPha').optional().notEmpty().withMessage('Tên cây gia phả không được để trống'),
  handleValidationErrors
];

// Validation cho thêm thành viên
const validateAddMember = [
  param('treeId').isInt().withMessage('ID cây gia phả không hợp lệ'),
  body('ten').notEmpty().withMessage('Tên thành viên không được để trống'),
  body('gioiTinh').isIn(['Nam', 'Nữ']).withMessage('Giới tính phải là Nam hoặc Nữ'),
  body('ngaySinh').optional().isDate().withMessage('Ngày sinh không hợp lệ'),
  body('ngayMat').optional().isDate().withMessage('Ngày mất không hợp lệ'),
  body('idCha').optional().isInt().withMessage('ID cha không hợp lệ'),
  body('idMe').optional().isInt().withMessage('ID mẹ không hợp lệ'),
  body('idVoChong').optional().isInt().withMessage('ID vợ/chồng không hợp lệ'),
  handleValidationErrors
];

// Validation cho cập nhật thành viên
const validateUpdateMember = [
  param('treeId').isInt().withMessage('ID cây gia phả không hợp lệ'),
  param('memberId').isInt().withMessage('ID thành viên không hợp lệ'),
  body('ten').optional().notEmpty().withMessage('Tên thành viên không được để trống'),
  body('gioiTinh').optional().isIn(['Nam', 'Nữ']).withMessage('Giới tính phải là Nam hoặc Nữ'),
  body('ngaySinh').optional().isDate().withMessage('Ngày sinh không hợp lệ'),
  body('ngayMat').optional().isDate().withMessage('Ngày mất không hợp lệ'),
  body('idCha').optional().isInt().withMessage('ID cha không hợp lệ'),
  body('idMe').optional().isInt().withMessage('ID mẹ không hợp lệ'),
  body('idVoChong').optional().isInt().withMessage('ID vợ/chồng không hợp lệ'),
  handleValidationErrors
];

// Validation cho thêm quan hệ vợ chồng
const validateSpouseRelation = [
  param('treeId').isInt().withMessage('ID cây gia phả không hợp lệ'),
  param('memberId').isInt().withMessage('ID thành viên không hợp lệ'),
  body('spouseId').isInt().withMessage('ID bạn đời không hợp lệ'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateCreateTree,
  validateUpdateTree,
  validateAddMember,
  validateUpdateMember,
  validateSpouseRelation
};
