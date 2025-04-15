import React, { useEffect, useState } from 'react';
import { getFunds, addFund, deleteFund, addTransaction } from '../../utils/storage';
import './FamilyFunds.css';

const FamilyFunds = () => {
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddFund, setShowAddFund] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newFund, setNewFund] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    qrCode: null,
    qrCodePreview: null
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Load dữ liệu khi component mount
  useEffect(() => {
    const loadFunds = async () => {
      try {
        const data = await getFunds();
        setFunds(data);
      } catch (error) {
        console.error('Error loading funds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFunds();
  }, []);

  // Xử lý thêm quỹ mới
  const handleAddFund = async (newFund) => {
    try {
      const updatedFunds = await addFund(newFund);
      if (updatedFunds) {
        setFunds(updatedFunds);
        setShowAddFund(false);
      }
    } catch (error) {
      console.error('Error adding fund:', error);
    }
  };

  // Xử lý xóa quỹ
  const handleDeleteFund = async (fundId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quỹ này?')) {
      try {
        const updatedFunds = await deleteFund(fundId);
        if (updatedFunds) {
          setFunds(updatedFunds);
          setSelectedFund(null);
        }
      } catch (error) {
        console.error('Error deleting fund:', error);
      }
    }
  };

  // Xử lý thêm giao dịch
  const handleAddTransaction = async (fundId, transaction) => {
    try {
      const updatedFunds = await addTransaction(fundId, transaction);
      if (updatedFunds) {
        setFunds(updatedFunds);
        setShowTransaction(false);
        // Cập nhật selectedFund nếu đang xem chi tiết
        if (selectedFund) {
          const updatedFund = updatedFunds.find(f => f.id === selectedFund.id);
          setSelectedFund(updatedFund);
        }
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Lọc quỹ theo tên
  const filteredFunds = funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFund(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFund(prev => ({
          ...prev,
          qrCode: file,
          qrCodePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newFund.name || !newFund.targetAmount) {
      showAlertMessage('Vui lòng điền đầy đủ thông tin', 'danger');
      return;
    }

    const fund = {
      id: Date.now(),
      name: newFund.name,
      description: newFund.description,
      targetAmount: parseFloat(newFund.targetAmount),
      currentAmount: parseFloat(newFund.currentAmount),
      qrCode: newFund.qrCodePreview,
      createdAt: new Date().toISOString(),
      transactions: []
    };

    const updatedFunds = [...funds, fund];
    setFunds(updatedFunds);
    localStorage.setItem('familyFunds', JSON.stringify(updatedFunds));
    
    setNewFund({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      qrCode: null,
      qrCodePreview: null
    });
    setShowModal(false);
    showAlertMessage('Đã tạo quỹ thành công!', 'success');
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="family-funds-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="family-funds-container">
      <div className="family-funds-header">
        <h2 className="family-funds-title">Quỹ gia đình</h2>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>Tạo Quỹ Mới
          </button>

          <div className="search-box">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm quỹ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {showAlert && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          {alertMessage}
          <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}

      {/* Danh sách quỹ */}
      <div className="family-funds-grid">
        {filteredFunds.map(fund => (
          <div key={fund.id} className="family-fund-card">
            <div className="family-fund-card-body">
              <h5 className="family-fund-card-title">{fund.name}</h5>
              <p className="family-fund-card-description">{fund.description}</p>
              {fund.qrCode && (
                <div className="text-center mb-3">
                  <img 
                    src={fund.qrCode} 
                    alt="QR Code" 
                    className="img-fluid"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              )}
              <div className="progress mb-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${calculateProgress(fund.currentAmount, fund.targetAmount)}%` }}
                >
                  {calculateProgress(fund.currentAmount, fund.targetAmount).toFixed(1)}%
                </div>
              </div>
              <p className="mb-1">
                <strong>Đã quyên góp:</strong> {formatCurrency(fund.currentAmount)}
              </p>
              <p className="mb-0">
                <strong>Mục tiêu:</strong> {formatCurrency(fund.targetAmount)}
              </p>
            </div>
            <div className="family-fund-card-footer">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedFund(fund)}
              >
                Xem chi tiết
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteFund(fund.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm quỹ */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tạo Quỹ Mới</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Tên quỹ</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={newFund.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={newFund.description}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số tiền mục tiêu (VND)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="targetAmount"
                      value={newFund.targetAmount}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">QR Code chuyển khoản</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {newFund.qrCodePreview && (
                      <div className="mt-2 text-center">
                        <img 
                          src={newFund.qrCodePreview} 
                          alt="QR Code Preview" 
                          className="img-fluid"
                          style={{ maxWidth: '200px' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Tạo Quỹ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết quỹ */}
      {selectedFund && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedFund.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedFund(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="fund-details">
                  <p><strong>Mô tả:</strong> {selectedFund.description}</p>
                  <p><strong>Số dư hiện tại:</strong> {formatCurrency(selectedFund.currentAmount)}</p>
                  {selectedFund.qrCode && (
                    <div className="fund-qr">
                      <img src={selectedFund.qrCode} alt={`QR ${selectedFund.name}`} className="img-fluid" style={{ maxWidth: '200px' }} />
                    </div>
                  )}
                  
                  <div className="fund-transactions">
                    <h6>Lịch sử giao dịch</h6>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Ngày</th>
                          <th>Người giao dịch</th>
                          <th>Số tiền</th>
                          <th>Loại</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedFund.transactions || []).map(trans => (
                          <tr key={trans.id}>
                            <td>{new Date(trans.date).toLocaleDateString()}</td>
                            <td>{trans.contributor}</td>
                            <td>{formatCurrency(trans.amount)}</td>
                            <td>{trans.type === 'deposit' ? 'Đóng góp' : 'Rút tiền'}</td>
                          </tr>
                        ))}
                        {(!selectedFund.transactions || selectedFund.transactions.length === 0) && (
                          <tr>
                            <td colSpan="4" className="text-center">Chưa có giao dịch nào</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowTransaction(true)}
                >
                  Thêm giao dịch
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedFund(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm giao dịch */}
      {showTransaction && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm giao dịch</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTransaction(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddTransaction(selectedFund.id, {
                    id: Date.now().toString(),
                    amount: parseInt(formData.get('amount')),
                    contributor: formData.get('contributor'),
                    date: new Date().toISOString(),
                    type: formData.get('type')
                  });
                }}>
                  <div className="mb-3">
                    <label className="form-label">Số tiền</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Người giao dịch</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contributor"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Loại giao dịch</label>
                    <select className="form-select" name="type" required>
                      <option value="deposit">Đóng góp</option>
                      <option value="withdraw">Rút tiền</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Thêm
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyFunds; 