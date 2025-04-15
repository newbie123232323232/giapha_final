const { FamilyImage, ThanhVien, GiaPha } = require('../models');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/family-images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const familyImageController = {
  // Tải lên ảnh mới
  uploadImage: async (req, res) => {
    try {
      const { TenAnh, MoTa, ID_ThanhVien, ID_GiaPha } = req.body;
      const image = await FamilyImage.create({
        TenAnh,
        MoTa,
        DuongDan: req.file.path,
        ID_ThanhVien,
        ID_GiaPha
      });
      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy danh sách ảnh
  getImages: async (req, res) => {
    try {
      const images = await FamilyImage.findAll({
        include: [
          {
            model: ThanhVien,
            attributes: ['Ten']
          },
          {
            model: GiaPha,
            attributes: ['TenGiaPha']
          }
        ]
      });
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy ảnh theo gia phả
  getImagesByFamilyTree: async (req, res) => {
    try {
      const images = await FamilyImage.findAll({
        where: { ID_GiaPha: req.params.treeId },
        include: [
          {
            model: ThanhVien,
            attributes: ['Ten']
          },
          {
            model: GiaPha,
            attributes: ['TenGiaPha']
          }
        ]
      });
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy thông tin chi tiết ảnh
  getImageById: async (req, res) => {
    try {
      const image = await FamilyImage.findByPk(req.params.id, {
        include: [
          {
            model: ThanhVien,
            attributes: ['Ten']
          },
          {
            model: GiaPha,
            attributes: ['TenGiaPha']
          }
        ]
      });
      if (!image) {
        return res.status(404).json({ message: 'Không tìm thấy ảnh' });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật thông tin ảnh
  updateImage: async (req, res) => {
    try {
      const { TenAnh, MoTa } = req.body;
      const image = await FamilyImage.findByPk(req.params.id);
      if (!image) {
        return res.status(404).json({ message: 'Không tìm thấy ảnh' });
      }
      await image.update({ TenAnh, MoTa });
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Xóa ảnh
  deleteImage: async (req, res) => {
    try {
      const image = await FamilyImage.findByPk(req.params.id);
      if (!image) {
        return res.status(404).json({ message: 'Không tìm thấy ảnh' });
      }
      
      // Xóa file ảnh
      const fs = require('fs');
      if (fs.existsSync(image.DuongDan)) {
        fs.unlinkSync(image.DuongDan);
      }
      
      await image.destroy();
      res.json({ message: 'Đã xóa ảnh thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  familyImageController,
  upload
}; 