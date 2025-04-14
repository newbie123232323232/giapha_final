import React, { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';
import './Events.css';

// Hàm để lấy ngày hiện tại ở định dạng YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Hàm để lấy ngày tối thiểu cho input date (ngày hiện tại)
const getMinDate = () => {
  return getCurrentDate();
};

const Events = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    tenSuKien: '',
    ngayToChuc: getMinDate(),
    moTa: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ngayToChuc');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' });

  // Kiểm tra đăng nhập
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(!!getToken());
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Lấy dữ liệu sự kiện từ file JSON
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Giả lập việc gọi API để lấy dữ liệu
        const response = await fetch('/client/src/data/events.json');
        const data = await response.json();
        
        // Thực tế sẽ dùng local storage ở đây vì không có API thật
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        } else {
          setEvents(data.events);
          localStorage.setItem('events', JSON.stringify(data.events));
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu sự kiện:', error);
        // Nếu không có dữ liệu, sử dụng dữ liệu mẫu
        const demoEvents = [
          {
            id: 1,
            tenSuKien: "Lễ giỗ tổ họ Nguyễn",
            ngayToChuc: "2024-12-15",
            moTa: "Lễ giỗ tổ hàng năm của dòng họ Nguyễn, tổ chức tại đình làng.",
            createdAt: "2024-04-15T08:30:00"
          },
          {
            id: 2,
            tenSuKien: "Họp mặt gia đình cuối năm",
            ngayToChuc: "2024-12-30",
            moTa: "Gặp mặt tất cả thành viên trong gia đình, chia sẻ kết quả năm qua và kế hoạch năm mới.",
            createdAt: "2024-04-16T10:15:00"
          }
        ];
        setEvents(demoEvents);
        localStorage.setItem('events', JSON.stringify(demoEvents));
      }
    };

    loadEvents();
  }, []);

  // Lưu dữ liệu khi có thay đổi
  const saveDataToJson = (updatedEvents) => {
    // Giả lập việc gửi dữ liệu lên API
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  // Hiển thị thông báo
  const showAlertMessage = (message, type = 'success') => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => {
      setShowAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Lọc và sắp xếp sự kiện
  const filteredAndSortedEvents = () => {
    return events
      .filter(event => 
        event.tenSuKien.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.moTa.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'ngayToChuc') {
          const dateA = new Date(a.ngayToChuc);
          const dateB = new Date(b.ngayToChuc);
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'tenSuKien') {
          return sortOrder === 'asc' 
            ? a.tenSuKien.localeCompare(b.tenSuKien)
            : b.tenSuKien.localeCompare(a.tenSuKien);
        }
        return 0;
      });
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Xử lý thêm sự kiện mới
  const handleAddEvent = () => {
    if (!newEvent.tenSuKien.trim()) {
      showAlertMessage('Vui lòng nhập tên sự kiện', 'danger');
      return;
    }

    const now = new Date();
    const createdAt = now.toISOString();
    
    const updatedEvents = [
      ...events,
      {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        tenSuKien: newEvent.tenSuKien,
        ngayToChuc: newEvent.ngayToChuc,
        moTa: newEvent.moTa,
        createdAt
      }
    ];

    saveDataToJson(updatedEvents);
    setShowAddEventModal(false);
    setNewEvent({
      tenSuKien: '',
      ngayToChuc: getMinDate(),
      moTa: ''
    });
    showAlertMessage('Thêm sự kiện thành công!');
  };

  // Xử lý cập nhật sự kiện
  const handleUpdateEvent = () => {
    if (!selectedEvent || !selectedEvent.tenSuKien.trim()) {
      showAlertMessage('Vui lòng nhập tên sự kiện', 'danger');
      return;
    }

    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    );

    saveDataToJson(updatedEvents);
    setShowEditEventModal(false);
    setSelectedEvent(null);
    showAlertMessage('Cập nhật sự kiện thành công!');
  };

  // Xử lý xóa sự kiện
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    saveDataToJson(updatedEvents);
    setShowDeleteModal(false);
    setSelectedEvent(null);
    showAlertMessage('Xóa sự kiện thành công!');
  };

  // Tính số ngày còn lại
  const getDaysRemaining = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(eventDate);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Lấy class cho trạng thái sự kiện
  const getEventStatusClass = (days) => {
    if (days < 0) return 'event-passed';
    if (days <= 7) return 'event-upcoming';
    if (days <= 30) return 'event-planned';
    return '';
  };

  // Lấy text cho trạng thái sự kiện
  const getEventStatusText = (days) => {
    if (days < 0) return 'Đã diễn ra';
    if (days === 0) return 'Hôm nay';
    if (days === 1) return 'Ngày mai';
    if (days <= 7) return `Còn ${days} ngày`;
    if (days <= 30) return `Còn ${days} ngày`;
    return `Còn ${days} ngày`;
  };

  return (
    <div className="events-container">
      {showAlert.show && (
        <div className={`alert alert-${showAlert.type} alert-floating`} role="alert">
          {showAlert.message}
        </div>
      )}

      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="mb-4">Quản lý sự kiện gia đình</h1>
          </div>
          {isLoggedIn && (
            <div className="col-md-4 text-end">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setNewEvent({
                    tenSuKien: '',
                    ngayToChuc: getMinDate(),
                    moTa: ''
                  });
                  setShowAddEventModal(true);
                }}
              >
                <i className="bi bi-plus-circle me-2"></i>Thêm sự kiện mới
              </button>
            </div>
          )}
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <div className="me-2">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="ngayToChuc">Sắp xếp theo ngày</option>
                  <option value="tenSuKien">Sắp xếp theo tên</option>
                </select>
              </div>
              <div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <i className={`bi bi-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hiển thị sự kiện sắp tới */}
        <div className="row">
          <div className="col-12">
            <h4 className="mb-3">Sự kiện sắp diễn ra</h4>
          </div>
        </div>
        
        <div className="row upcoming-events mb-5">
          {filteredAndSortedEvents()
            .filter(event => getDaysRemaining(event.ngayToChuc) >= 0)
            .slice(0, 3)
            .map(event => {
              const daysRemaining = getDaysRemaining(event.ngayToChuc);
              const statusClass = getEventStatusClass(daysRemaining);
              const statusText = getEventStatusText(daysRemaining);
              
              return (
                <div className="col-md-4 mb-4" key={event.id}>
                  <div className={`card event-card h-100 ${statusClass}`}>
                    <div className="card-status-badge">{statusText}</div>
                    <div className="card-body">
                      <h5 className="card-title">{event.tenSuKien}</h5>
                      <p className="card-date">
                        <i className="bi bi-calendar-event me-2"></i>
                        {formatDate(event.ngayToChuc)}
                      </p>
                      <p className="card-text">{event.moTa}</p>
                    </div>
                    {isLoggedIn && (
                      <div className="card-footer bg-transparent border-top-0">
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEditEventModal(true);
                            }}
                          >
                            <i className="bi bi-pencil me-1"></i> Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="bi bi-trash me-1"></i> Xóa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
          {filteredAndSortedEvents().filter(event => getDaysRemaining(event.ngayToChuc) >= 0).length === 0 && (
            <div className="col-12">
              <div className="alert alert-info">
                Không có sự kiện nào sắp diễn ra.
              </div>
            </div>
          )}
        </div>

        {/* Danh sách tất cả sự kiện */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="mb-3">Tất cả sự kiện</h4>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Tên sự kiện</th>
                    <th>Ngày tổ chức</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    {isLoggedIn && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedEvents().length > 0 ? (
                    filteredAndSortedEvents().map(event => {
                      const daysRemaining = getDaysRemaining(event.ngayToChuc);
                      const statusClass = getEventStatusClass(daysRemaining);
                      const statusText = getEventStatusText(daysRemaining);
                      
                      return (
                        <tr key={event.id}>
                          <td>{event.tenSuKien}</td>
                          <td>{formatDate(event.ngayToChuc)}</td>
                          <td className="event-description">{event.moTa}</td>
                          <td>
                            <span className={`badge ${statusClass}`}>{statusText}</span>
                          </td>
                          {isLoggedIn && (
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEditEventModal(true);
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={isLoggedIn ? 5 : 4} className="text-center">
                        Không tìm thấy sự kiện nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm sự kiện mới */}
      {showAddEventModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm sự kiện mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddEventModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên sự kiện <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEvent.tenSuKien}
                    onChange={(e) => setNewEvent({ ...newEvent, tenSuKien: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày tổ chức <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={newEvent.ngayToChuc}
                    min={getMinDate()}
                    onChange={(e) => setNewEvent({ ...newEvent, ngayToChuc: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newEvent.moTa}
                    onChange={(e) => setNewEvent({ ...newEvent, moTa: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEventModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddEvent}>
                  Thêm sự kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa sự kiện */}
      {showEditEventModal && selectedEvent && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa sự kiện</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditEventModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên sự kiện <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedEvent.tenSuKien}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, tenSuKien: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày tổ chức <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedEvent.ngayToChuc}
                    min={getMinDate()}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, ngayToChuc: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={selectedEvent.moTa}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, moTa: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditEventModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateEvent}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && selectedEvent && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa sự kiện <strong>{selectedEvent.tenSuKien}</strong> không?</p>
                <p>Hành động này không thể hoàn tác.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 