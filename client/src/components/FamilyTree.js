import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import familyTrees from '../data/familyTrees.json';
import './FamilyTree.css';

const FamilyTree = () => {
  const [selectedTree, setSelectedTree] = useState(null);
  const [trees, setTrees] = useState(familyTrees.trees);
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddSpouseModal, setShowAddSpouseModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAddFirstMemberModal, setShowAddFirstMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [parentMember, setParentMember] = useState(null);
  const [newTree, setNewTree] = useState({
    tenCayGiaPha: '',
    moTa: ''
  });
  const [newMember, setNewMember] = useState({
    ten: '',
    ngaySinh: '',
    ngayMat: '',
    gioiTinh: 'Nam',
    moTa: ''
  });

  // Giả lập việc lưu dữ liệu vào file JSON
  const saveDataToJson = (data) => {
    console.log('Đã lưu dữ liệu vào familyTrees.json:', data);
    // Trong thực tế, đây là nơi bạn sẽ gọi API để lưu dữ liệu
  };

  const handleAddTree = () => {
    const newTreeData = {
      idCayGiaPha: trees.length + 1,
      ...newTree,
      ngayTao: new Date().toISOString().split('T')[0],
      members: []
    };
    const updatedTrees = [...trees, newTreeData];
    setTrees(updatedTrees);
    setSelectedTree(newTreeData);  // Tự động chọn cây vừa tạo
    setShowAddTreeModal(false);
    setNewTree({ tenCayGiaPha: '', moTa: '' });
    saveDataToJson({ trees: updatedTrees });
  };

  const handleAddFirstMember = () => {
    if (!selectedTree) return;

    const newMemberData = {
      idThanhVien: Date.now(),
      layer: 1,
      ...newMember,
      spouse: null,
      children: []
    };

    const updatedTrees = trees.map(tree => {
      if (tree.idCayGiaPha === selectedTree.idCayGiaPha) {
        return {
          ...tree,
          members: [...tree.members, newMemberData]
        };
      }
      return tree;
    });

    setTrees(updatedTrees);
    setSelectedTree(updatedTrees.find(tree => tree.idCayGiaPha === selectedTree.idCayGiaPha));
    setShowAddFirstMemberModal(false);
    setNewMember({
      ten: '',
      ngaySinh: '',
      ngayMat: '',
      gioiTinh: 'Nam',
      moTa: ''
    });
    saveDataToJson({ trees: updatedTrees });
  };

  const handleAddMember = () => {
    if (!selectedTree) return;

    const newMemberData = {
      idThanhVien: Date.now(),
      layer: 1,
      ...newMember,
      spouse: null,
      children: []
    };

    const updatedTrees = trees.map(tree => {
      if (tree.idCayGiaPha === selectedTree.idCayGiaPha) {
        return {
          ...tree,
          members: [...tree.members, newMemberData]
        };
      }
      return tree;
    });

    setTrees(updatedTrees);
    setSelectedTree(updatedTrees.find(tree => tree.idCayGiaPha === selectedTree.idCayGiaPha));
    setShowAddMemberModal(false);
    setNewMember({
      ten: '',
      ngaySinh: '',
      ngayMat: '',
      gioiTinh: 'Nam',
      moTa: ''
    });
    saveDataToJson({ trees: updatedTrees });
  };

  const handleAddSpouse = () => {
    if (!selectedTree || !selectedMember) return;

    const spouseData = {
      idThanhVien: Date.now(),
      ...newMember
    };

    // Tìm thành viên trong cây và thêm bạn đời
    const findAndUpdateMember = (members) => {
      return members.map(member => {
        if (member.idThanhVien === selectedMember.idThanhVien) {
          return {
            ...member,
            spouse: spouseData
          };
        } else if (member.children && member.children.length > 0) {
          return {
            ...member,
            children: findAndUpdateMember(member.children)
          };
        }
        return member;
      });
    };

    const updatedTrees = trees.map(tree => {
      if (tree.idCayGiaPha === selectedTree.idCayGiaPha) {
        return {
          ...tree,
          members: findAndUpdateMember(tree.members)
        };
      }
      return tree;
    });

    setTrees(updatedTrees);
    setSelectedTree(updatedTrees.find(tree => tree.idCayGiaPha === selectedTree.idCayGiaPha));
    setShowAddSpouseModal(false);
    setSelectedMember(null);
    setNewMember({
      ten: '',
      ngaySinh: '',
      ngayMat: '',
      gioiTinh: selectedMember.gioiTinh === 'Nam' ? 'Nữ' : 'Nam',
      moTa: ''
    });
    saveDataToJson({ trees: updatedTrees });
  };

  const handleAddChild = () => {
    if (!selectedTree || !parentMember) return;

    const childData = {
      idThanhVien: Date.now(),
      layer: parentMember.layer + 1,
      ...newMember,
      spouse: null,
      children: []
    };

    // Tìm thành viên trong cây và thêm con
    const findAndUpdateMember = (members) => {
      return members.map(member => {
        if (member.idThanhVien === parentMember.idThanhVien) {
          // Thêm con vào mảng children của thành viên
          return {
            ...member,
            children: [...(member.children || []), childData]
          };
        } else if (member.children && member.children.length > 0) {
          return {
            ...member,
            children: findAndUpdateMember(member.children)
          };
        }
        return member;
      });
    };

    const updatedTrees = trees.map(tree => {
      if (tree.idCayGiaPha === selectedTree.idCayGiaPha) {
        return {
          ...tree,
          members: findAndUpdateMember(tree.members)
        };
      }
      return tree;
    });

    setTrees(updatedTrees);
    setSelectedTree(updatedTrees.find(tree => tree.idCayGiaPha === selectedTree.idCayGiaPha));
    setShowAddChildModal(false);
    setParentMember(null);
    setNewMember({
      ten: '',
      ngaySinh: '',
      ngayMat: '',
      gioiTinh: 'Nam',
      moTa: ''
    });
    saveDataToJson({ trees: updatedTrees });
  };

  const handleEditMember = () => {
    if (!selectedMember) return;

    // Tìm và cập nhật thành viên
    const findAndUpdateMember = (members) => {
      return members.map(member => {
        if (member.idThanhVien === selectedMember.idThanhVien) {
          return {
            ...member,
            ...newMember
          };
        } else if (member.children && member.children.length > 0) {
          return {
            ...member,
            children: findAndUpdateMember(member.children)
          };
        }
        return member;
      });
    };

    const updatedTrees = trees.map(tree => {
      if (tree.idCayGiaPha === selectedTree.idCayGiaPha) {
        return {
          ...tree,
          members: findAndUpdateMember(tree.members)
        };
      }
      return tree;
    });

    setTrees(updatedTrees);
    setSelectedTree(updatedTrees.find(tree => tree.idCayGiaPha === selectedTree.idCayGiaPha));
    setShowEditMemberModal(false);
    setSelectedMember(null);
    saveDataToJson({ trees: updatedTrees });
  };

  const handleDeleteMember = (memberId) => {
    if (!selectedTree) return;

    // Xóa thành viên (không ảnh hưởng đến nhánh con)
    const findAndDeleteMember = (members) => {
      const filteredMembers = members.filter(member => member.idThanhVien !== memberId);
      return filteredMembers.map(member => {
        if (member.children && member.children.length > 0) {
          return {
            ...member,
            children: findAndDeleteMember(member.children)
          };
        }
        return member;
      });
    };

    const updatedTrees = trees.map(tree => {
      if (tree.idCayGiaPha === selectedTree.idCayGiaPha) {
        return {
          ...tree,
          members: findAndDeleteMember(tree.members)
        };
      }
      return tree;
    });

    setTrees(updatedTrees);
    setSelectedTree(updatedTrees.find(tree => tree.idCayGiaPha === selectedTree.idCayGiaPha));
    setShowEditMemberModal(false);
    saveDataToJson({ trees: updatedTrees });
  };

  // Hàm để tìm thành viên trong cây
  const findMemberById = (members, id) => {
    for (const member of members) {
      if (member.idThanhVien === id) {
        return member;
      }
      if (member.children && member.children.length > 0) {
        const found = findMemberById(member.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const convertToTreeData = (members) => {
    if (!members || members.length === 0) {
      return {
        name: "Chưa có thành viên",
        attributes: {
          moTa: "Vui lòng thêm thành viên đầu tiên"
        },
        children: []
      };
    }
    
    // Nếu có nhiều thành viên ở cùng cấp 1, bao chúng trong một node root ảo
    if (members.length > 1) {
      return {
        name: "Gốc cây gia phả",
        attributes: {
          isRoot: true
        },
        children: members.map(member => createMemberNode(member))
      };
    } else {
      // Nếu chỉ có 1 thành viên ở cấp 1, dùng nó làm root
      const member = members[0];
      return createMemberNode(member);
    }
  };

  // Hàm tạo node cho mỗi thành viên
  const createMemberNode = (member) => {
    // Tạo node cho thành viên
    const memberNode = {
      name: member.ten,
      id: member.idThanhVien,
      attributes: {
        ngaySinh: member.ngaySinh,
        ngayMat: member.ngayMat,
        gioiTinh: member.gioiTinh,
        moTa: member.moTa,
        layer: member.layer
      }
    };

    // Nếu thành viên có bạn đời, tạo một nút "Cặp đôi chung"
    if (member.spouse) {
      // Tạo node cho bạn đời
      const spouseNode = {
        name: member.spouse.ten,
        id: member.spouse.idThanhVien,
        attributes: {
          ngaySinh: member.spouse.ngaySinh,
          ngayMat: member.spouse.ngayMat,
          gioiTinh: member.spouse.gioiTinh,
          moTa: member.spouse.moTa,
          isSpouse: true
        }
      };

      // Nếu có con, tạo node container cho tất cả con
      let containerNode = null;
      if (member.children && member.children.length > 0) {
        containerNode = {
          name: "Các con",
          attributes: {
            isChildrenContainer: true
          },
          children: member.children.map(child => createMemberNode(child))
        };
      }

      // Trả về cấu trúc "Cặp đôi" - bọc cả nhóm
      return {
        name: "Cặp đôi",
        attributes: {
          isCouple: true
        },
        children: [
          // Thành viên chính
          memberNode,
          // Bạn đời
          spouseNode,
          // Node container chứa tất cả con (nếu có)
          ...(containerNode ? [containerNode] : [])
        ]
      };
    } else {
      // Nếu không có bạn đời, tạo cấu trúc đơn giản
      
      // Nếu có con, tạo node container cho tất cả con
      if (member.children && member.children.length > 0) {
        const containerNode = {
          name: "Các con",
          attributes: {
            isChildrenContainer: true
          },
          children: member.children.map(child => createMemberNode(child))
        };
        
        // Gắn node container vào thành viên
        memberNode.children = [containerNode];
      } else {
        memberNode.children = [];
      }
      
      return memberNode;
    }
  };

  // Thêm một số log để debug
  const handleAddChildClick = (e, member) => {
    e.stopPropagation();
    console.log('Clicked Add Child for member:', member);
    setParentMember(member);
    setNewMember({
      ten: '',
      ngaySinh: '',
      ngayMat: '',
      gioiTinh: 'Nam',
      moTa: ''
    });
    setShowAddChildModal(true);
  };

  const handleAddSpouseClick = (e, member) => {
    e.stopPropagation();
    console.log('Clicked Add Spouse for member:', member);
    setSelectedMember(member);
    setNewMember({
      ten: '',
      ngaySinh: '',
      ngayMat: '',
      gioiTinh: member.gioiTinh === 'Nam' ? 'Nữ' : 'Nam',
      moTa: ''
    });
    setShowAddSpouseModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedTree?.idCayGiaPha || ''}
            onChange={(e) => {
              const tree = trees.find(t => t.idCayGiaPha === parseInt(e.target.value));
              setSelectedTree(tree);
            }}
          >
            <option value="">Chọn cây gia phả</option>
            {trees.map(tree => (
              <option key={tree.idCayGiaPha} value={tree.idCayGiaPha}>
                {tree.tenCayGiaPha}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <button
            className="btn btn-primary me-2"
            onClick={() => setShowAddTreeModal(true)}
          >
            Tạo cây mới
          </button>
          {selectedTree && selectedTree.members.length === 0 && (
            <button
              className="btn btn-success"
              onClick={() => setShowAddFirstMemberModal(true)}
            >
              Thêm thành viên đầu tiên
            </button>
          )}
        </div>
      </div>

      {selectedTree && (
        <div className="family-tree-container">
          <Tree
            data={convertToTreeData(selectedTree.members)}
            orientation="vertical"
            pathFunc="step"
            translate={{ x: 300, y: 50 }}
            nodeSize={{ x: 200, y: 150 }}
            renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
              <g>
                {/* Ẩn các node đặc biệt */}
                {nodeDatum.attributes?.isCouple || nodeDatum.attributes?.isChildrenContainer ? (
                  <g>
                    {/* Không hiển thị gì cho node đặc biệt */}
                  </g>
                ) : (
                  <g>
                    <rect 
                      width="160" 
                      height="100" 
                      x="-80" 
                      y="-40" 
                      fill={nodeDatum.attributes?.isSpouse ? "#ffecb3" : "#f8f9fa"}
                      stroke={nodeDatum.attributes?.isSpouse ? "#ffcc00" : "#dee2e6"}
                      strokeWidth="1" 
                      rx="5"
                      onClick={() => {
                        if (nodeDatum.attributes?.isSpouse || nodeDatum.attributes?.isRoot) return; // Không chọn bạn đời hoặc node gốc ảo
                        
                        if (selectedTree && nodeDatum.id) {
                          const member = findMemberById(selectedTree.members, nodeDatum.id);
                          if (member) {
                            setSelectedMember(member);
                            setNewMember({
                              ten: member.ten,
                              ngaySinh: member.ngaySinh || '',
                              ngayMat: member.ngayMat || '',
                              gioiTinh: member.gioiTinh,
                              moTa: member.moTa || ''
                            });
                            setShowEditMemberModal(true);
                          }
                        }
                      }}
                    />
                    <text fill="black" strokeWidth="0" x="-75" y="-15" textAnchor="start" fontSize="14">
                      {nodeDatum.name}
                    </text>
                    {nodeDatum.attributes?.gioiTinh && (
                      <text fill="black" strokeWidth="0" x="-75" y="5" textAnchor="start" fontSize="12">
                        Giới tính: {nodeDatum.attributes.gioiTinh}
                      </text>
                    )}
                    {nodeDatum.attributes?.ngaySinh && (
                      <text fill="black" strokeWidth="0" x="-75" y="25" textAnchor="start" fontSize="12">
                        Sinh: {nodeDatum.attributes.ngaySinh}
                      </text>
                    )}
                    {!nodeDatum.attributes?.isSpouse && !nodeDatum.attributes?.isRoot && nodeDatum.id && (
                      <g>
                        <rect 
                          width="50" 
                          height="25" 
                          x="-70" 
                          y="40" 
                          fill="#28a745" 
                          stroke="#1e7e34"
                          strokeWidth="1"
                          rx="3"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            if (selectedTree && nodeDatum.id) {
                              const member = findMemberById(selectedTree.members, nodeDatum.id);
                              if (member) {
                                handleAddChildClick(e, member);
                              }
                            }
                          }}
                        />
                        <text 
                          fill="white" 
                          x="-55" 
                          y="57" 
                          fontSize="12" 
                          textAnchor="start"
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                          onClick={(e) => {
                            if (selectedTree && nodeDatum.id) {
                              const member = findMemberById(selectedTree.members, nodeDatum.id);
                              if (member) {
                                handleAddChildClick(e, member);
                              }
                            }
                          }}
                        >+Con</text>
                        
                        {!nodeDatum.attributes?.isSpouse && !nodeDatum.parent?.data?.attributes?.isCouple && (
                          <>
                            <rect 
                              width="70" 
                              height="25" 
                              x="0" 
                              y="40" 
                              fill="#007bff" 
                              stroke="#0069d9"
                              strokeWidth="1"
                              rx="3"
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                if (selectedTree && nodeDatum.id) {
                                  const member = findMemberById(selectedTree.members, nodeDatum.id);
                                  if (member) {
                                    handleAddSpouseClick(e, member);
                                  }
                                }
                              }}
                            />
                            <text 
                              fill="white" 
                              x="10" 
                              y="57" 
                              fontSize="12" 
                              textAnchor="start"
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={(e) => {
                                if (selectedTree && nodeDatum.id) {
                                  const member = findMemberById(selectedTree.members, nodeDatum.id);
                                  if (member) {
                                    handleAddSpouseClick(e, member);
                                  }
                                }
                              }}
                            >+Bạn đời</text>
                          </>
                        )}
                      </g>
                    )}
                  </g>
                )}
              </g>
            )}
          />
        </div>
      )}

      {/* Modal thêm cây mới */}
      {showAddTreeModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ zIndex: 1050, marginTop: '100px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo cây gia phả mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddTreeModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên cây gia phả</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTree.tenCayGiaPha}
                    onChange={(e) => setNewTree({ ...newTree, tenCayGiaPha: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={newTree.moTa}
                    onChange={(e) => setNewTree({ ...newTree, moTa: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddTreeModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddTree}>
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm thành viên đầu tiên */}
      {showAddFirstMemberModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ zIndex: 1050, marginTop: '100px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm thành viên đầu tiên</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddFirstMemberModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMember.ten}
                    onChange={(e) => setNewMember({ ...newMember, ten: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngaySinh}
                    onChange={(e) => setNewMember({ ...newMember, ngaySinh: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày mất</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngayMat}
                    onChange={(e) => setNewMember({ ...newMember, ngayMat: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={newMember.gioiTinh}
                    onChange={(e) => setNewMember({ ...newMember, gioiTinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={newMember.moTa}
                    onChange={(e) => setNewMember({ ...newMember, moTa: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddFirstMemberModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddFirstMember}>
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm bạn đời */}
      {showAddSpouseModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ zIndex: 1050, marginTop: '100px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm bạn đời cho {selectedMember?.ten}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddSpouseModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMember.ten}
                    onChange={(e) => setNewMember({ ...newMember, ten: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngaySinh}
                    onChange={(e) => setNewMember({ ...newMember, ngaySinh: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày mất</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngayMat}
                    onChange={(e) => setNewMember({ ...newMember, ngayMat: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={newMember.gioiTinh}
                    onChange={(e) => setNewMember({ ...newMember, gioiTinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={newMember.moTa}
                    onChange={(e) => setNewMember({ ...newMember, moTa: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSpouseModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddSpouse}>
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm con */}
      {showAddChildModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ zIndex: 1050, marginTop: '100px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm con cho {parentMember?.ten}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddChildModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMember.ten}
                    onChange={(e) => setNewMember({ ...newMember, ten: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngaySinh}
                    onChange={(e) => setNewMember({ ...newMember, ngaySinh: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày mất</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngayMat}
                    onChange={(e) => setNewMember({ ...newMember, ngayMat: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={newMember.gioiTinh}
                    onChange={(e) => setNewMember({ ...newMember, gioiTinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={newMember.moTa}
                    onChange={(e) => setNewMember({ ...newMember, moTa: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddChildModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddChild}>
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa thành viên */}
      {showEditMemberModal && selectedMember && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ zIndex: 1050, marginTop: '100px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sửa thông tin thành viên</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditMemberModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newMember.ten}
                    onChange={(e) => setNewMember({ ...newMember, ten: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngaySinh}
                    onChange={(e) => setNewMember({ ...newMember, ngaySinh: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày mất</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newMember.ngayMat}
                    onChange={(e) => setNewMember({ ...newMember, ngayMat: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={newMember.gioiTinh}
                    onChange={(e) => setNewMember({ ...newMember, gioiTinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    value={newMember.moTa}
                    onChange={(e) => setNewMember({ ...newMember, moTa: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger me-2" onClick={() => {
                  handleDeleteMember(selectedMember.idThanhVien);
                  setShowEditMemberModal(false);
                }}>
                  Xóa
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditMemberModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditMember}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree; 