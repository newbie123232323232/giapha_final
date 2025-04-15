const { FamilyFund, FundTransaction, ThanhVien } = require('../models');

const familyFundController = {
  // Tạo quỹ mới
  createFund: async (req, res) => {
    try {
      const { TenQuy, MoTa, SoTienMucTieu, QRCode, ID_ThanhVien } = req.body;
      const fund = await FamilyFund.create({
        TenQuy,
        MoTa,
        SoTienMucTieu,
        QRCode,
        ID_ThanhVien,
        SoTienHienTai: 0
      });
      res.status(201).json(fund);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy danh sách quỹ
  getFunds: async (req, res) => {
    try {
      const funds = await FamilyFund.findAll({
        include: [{
          model: ThanhVien,
          attributes: ['Ten']
        }]
      });
      res.json(funds);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy thông tin chi tiết quỹ
  getFundById: async (req, res) => {
    try {
      const fund = await FamilyFund.findByPk(req.params.id, {
        include: [{
          model: ThanhVien,
          attributes: ['Ten']
        }]
      });
      if (!fund) {
        return res.status(404).json({ message: 'Không tìm thấy quỹ' });
      }
      res.json(fund);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật thông tin quỹ
  updateFund: async (req, res) => {
    try {
      const { TenQuy, MoTa, SoTienMucTieu, QRCode } = req.body;
      const fund = await FamilyFund.findByPk(req.params.id);
      if (!fund) {
        return res.status(404).json({ message: 'Không tìm thấy quỹ' });
      }
      await fund.update({ TenQuy, MoTa, SoTienMucTieu, QRCode });
      res.json(fund);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Xóa quỹ
  deleteFund: async (req, res) => {
    try {
      const fund = await FamilyFund.findByPk(req.params.id);
      if (!fund) {
        return res.status(404).json({ message: 'Không tìm thấy quỹ' });
      }
      await fund.destroy();
      res.json({ message: 'Đã xóa quỹ thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Thêm giao dịch
  addTransaction: async (req, res) => {
    try {
      const { SoTien, LoaiGiaoDich, ID_Quy, ID_ThanhVien, MoTa } = req.body;
      
      // Tạo giao dịch
      const transaction = await FundTransaction.create({
        SoTien,
        LoaiGiaoDich,
        ID_Quy,
        ID_ThanhVien,
        MoTa
      });

      // Cập nhật số tiền hiện tại của quỹ
      const fund = await FamilyFund.findByPk(ID_Quy);
      if (LoaiGiaoDich === 'deposit') {
        fund.SoTienHienTai += SoTien;
      } else {
        fund.SoTienHienTai -= SoTien;
      }
      await fund.save();

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy lịch sử giao dịch
  getTransactions: async (req, res) => {
    try {
      const transactions = await FundTransaction.findAll({
        where: { ID_Quy: req.params.fundId },
        include: [{
          model: ThanhVien,
          attributes: ['Ten']
        }],
        order: [['NgayGiaoDich', 'DESC']]
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = familyFundController; 