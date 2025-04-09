const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();


// Đăng ký
const register = async (req, res) => {
  try {
    const { HoTen, Email, MatKhau, NgaySinh, GioiTinh } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng.' });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    // Tạo người dùng
    const newUser = await User.create({
      HoTen,
      Email,
      MatKhau: hashedPassword,
      HashMatKhau: hashedPassword,
      NgaySinh,
      GioiTinh,
    });

    res.status(201).json({ message: 'Đăng ký thành công.', user: newUser });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đăng ký thất bại.' });
  }
};


// Đăng nhập
const login = async (req, res) => {
  try {
    const { Email, MatKhau } = req.body;

    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res.status(401).json({ message: 'Email không tồn tại.' });
    }

    const passwordMatch = await bcrypt.compare(MatKhau, user.MatKhau);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Sai mật khẩu.' });
    }

    const token = jwt.sign(
      { id: user.ID, email: user.Email, role: user.VaiTro },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Đăng nhập thành công.', token, user });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đăng nhập thất bại.' });
  }
};


// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, HoTen, Email, NgaySinh, GioiTinh, Avatar } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.MatKhau);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu cũ không đúng.' });
    }

    // Nếu có mật khẩu mới thì cập nhật
    if (newPassword) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.MatKhau = hashedNewPassword;
      user.HashMatKhau = hashedNewPassword;
    }

    // Cập nhật thông tin cá nhân nếu có gửi lên
    if (HoTen !== undefined) user.HoTen = HoTen;
    if (Email !== undefined) user.Email = Email;
    if (NgaySinh !== undefined) user.NgaySinh = NgaySinh;
    if (GioiTinh !== undefined) user.GioiTinh = GioiTinh;
    if (Avatar !== undefined) user.Avatar = Avatar;

    await user.save();

    res.status(200).json({ message: 'Cập nhật thành công.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin:', error);
    res.status(500).json({ message: 'Cập nhật thất bại.' });
  }
};




const deleteAccount = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }
  
      await user.destroy();
      res.status(200).json({ message: 'Tài khoản đã bị xóa.' });
    } catch (error) {
      console.error('Lỗi xóa tài khoản:', error);
      res.status(500).json({ message: 'Xóa tài khoản thất bại.' });
    }
  };

// 👇 THÊM mới: Lấy thông tin người dùng hiện tại (GET /api/auth/me)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['MatKhau', 'HashMatKhau'] }, // Ẩn mật khẩu
    });

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Không thể lấy thông tin người dùng.' });
  }
};
  

module.exports = {
  register,
  login,
  changePassword,
  deleteAccount,
  getCurrentUser
};
