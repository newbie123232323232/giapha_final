const familyTreeService = require('../services/family-tree.service');

// Lấy danh sách cây gia phả của người dùng
const getTreesByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const trees = await familyTreeService.getUserTrees(userId);
    res.status(200).json(trees);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách cây gia phả:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
  }
};

// Lấy chi tiết một cây gia phả
const getTreeById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId } = req.params;
    
    const tree = await familyTreeService.getTreeDetails(treeId, userId);
    res.status(200).json(tree);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết cây gia phả:', error);
    if (error.message === 'Không tìm thấy cây gia phả') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi truy vấn dữ liệu.' });
  }
};

// Tạo cây gia phả mới
const createTree = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tenCayGiaPha, moTa } = req.body;
    
    const newTree = await familyTreeService.createTree({ tenCayGiaPha, moTa }, userId);
    
    res.status(201).json({ 
      message: 'Tạo cây gia phả thành công.', 
      tree: newTree 
    });
  } catch (error) {
    console.error('Lỗi khi tạo cây gia phả:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo cây gia phả.' });
  }
};

// Cập nhật thông tin cây gia phả
const updateTree = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId } = req.params;
    const { tenCayGiaPha, moTa } = req.body;
    
    const tree = await familyTreeService.updateTree(treeId, { tenCayGiaPha, moTa }, userId);
    
    res.status(200).json({ 
      message: 'Cập nhật cây gia phả thành công.', 
      tree: tree 
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật cây gia phả:', error);
    if (error.message === 'Không tìm thấy cây gia phả') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật cây gia phả.' });
  }
};

// Xóa cây gia phả
const deleteTree = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId } = req.params;
    
    await familyTreeService.deleteTree(treeId, userId);
    
    res.status(200).json({ message: 'Xóa cây gia phả thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa cây gia phả:', error);
    if (error.message === 'Không tìm thấy cây gia phả') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa cây gia phả.' });
  }
};

// Thêm thành viên vào cây gia phả
const addMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId } = req.params;
    const { ten, ngaySinh, ngayMat, gioiTinh, moTa, anhDaiDien, idCha, idMe, idVoChong } = req.body;
    
    const newMember = await familyTreeService.addMember(treeId, { 
      ten, ngaySinh, ngayMat, gioiTinh, moTa, anhDaiDien, idCha, idMe, idVoChong 
    }, userId);
    
    res.status(201).json({ 
      message: 'Thêm thành viên thành công.', 
      member: newMember 
    });
  } catch (error) {
    console.error('Lỗi khi thêm thành viên:', error);
    if (error.message === 'Không tìm thấy cây gia phả') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm thành viên.' });
  }
};

// Cập nhật thông tin thành viên
const updateMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId, memberId } = req.params;
    const { ten, ngaySinh, ngayMat, gioiTinh, moTa, anhDaiDien, idCha, idMe, idVoChong } = req.body;
    
    const member = await familyTreeService.updateMember(treeId, memberId, { 
      ten, ngaySinh, ngayMat, gioiTinh, moTa, anhDaiDien, idCha, idMe, idVoChong 
    }, userId);
    
    res.status(200).json({ 
      message: 'Cập nhật thành viên thành công.', 
      member: member 
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật thành viên:', error);
    if (error.message === 'Không tìm thấy cây gia phả' || error.message === 'Không tìm thấy thành viên') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thành viên.' });
  }
};

// Xóa thành viên
const deleteMember = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId, memberId } = req.params;
    
    await familyTreeService.deleteMember(treeId, memberId, userId);
    
    res.status(200).json({ message: 'Xóa thành viên thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa thành viên:', error);
    if (error.message === 'Không tìm thấy cây gia phả' || error.message === 'Không tìm thấy thành viên') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('Thành viên có con')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thành viên.' });
  }
};

// Thêm mối quan hệ vợ chồng
const addSpouseRelation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { treeId, memberId } = req.params;
    const { spouseId } = req.body;
    
    await familyTreeService.createSpouseRelation(treeId, memberId, spouseId, userId);
    
    res.status(200).json({ message: 'Thêm mối quan hệ vợ chồng thành công.' });
  } catch (error) {
    console.error('Lỗi khi thêm mối quan hệ vợ chồng:', error);
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm mối quan hệ vợ chồng.' });
  }
};

module.exports = {
  getTreesByUser,
  getTreeById,
  createTree,
  updateTree,
  deleteTree,
  addMember,
  updateMember,
  deleteMember,
  addSpouseRelation
}; 