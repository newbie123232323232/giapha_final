const { GroupChat, ChatMessage, ThanhVien } = require('../models');

const groupChatController = {
  // Tạo nhóm chat mới
  createGroup: async (req, res) => {
    try {
      const { TenNhom, MoTa, ID_ThanhVien } = req.body;
      const group = await GroupChat.create({
        TenNhom,
        MoTa,
        ID_ThanhVien
      });
      res.status(201).json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy danh sách nhóm chat
  getGroups: async (req, res) => {
    try {
      const groups = await GroupChat.findAll({
        include: [{
          model: ThanhVien,
          attributes: ['Ten']
        }]
      });
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy thông tin chi tiết nhóm chat
  getGroupById: async (req, res) => {
    try {
      const group = await GroupChat.findByPk(req.params.id, {
        include: [{
          model: ThanhVien,
          attributes: ['Ten']
        }]
      });
      if (!group) {
        return res.status(404).json({ message: 'Không tìm thấy nhóm chat' });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cập nhật thông tin nhóm chat
  updateGroup: async (req, res) => {
    try {
      const { TenNhom, MoTa } = req.body;
      const group = await GroupChat.findByPk(req.params.id);
      if (!group) {
        return res.status(404).json({ message: 'Không tìm thấy nhóm chat' });
      }
      await group.update({ TenNhom, MoTa });
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Xóa nhóm chat
  deleteGroup: async (req, res) => {
    try {
      const group = await GroupChat.findByPk(req.params.id);
      if (!group) {
        return res.status(404).json({ message: 'Không tìm thấy nhóm chat' });
      }
      await group.destroy();
      res.json({ message: 'Đã xóa nhóm chat thành công' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Gửi tin nhắn
  sendMessage: async (req, res) => {
    try {
      const { NoiDung, ID_NhomChat, ID_ThanhVien } = req.body;
      const message = await ChatMessage.create({
        NoiDung,
        ID_NhomChat,
        ID_ThanhVien
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Lấy tin nhắn của nhóm
  getMessages: async (req, res) => {
    try {
      const messages = await ChatMessage.findAll({
        where: { ID_NhomChat: req.params.groupId },
        include: [{
          model: ThanhVien,
          attributes: ['Ten']
        }],
        order: [['NgayGui', 'ASC']]
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = groupChatController; 