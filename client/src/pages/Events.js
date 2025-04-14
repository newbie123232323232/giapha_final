import React, { useState, useEffect } from 'react';
import { getEventsData, addEvent, updateEvent, deleteEvent } from '../utils/eventUtils';
import { getToken } from '../utils/auth';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    tenSuKien: '',
    ngayToChuc: '',
    moTa: ''
  });

  // Kiểm tra đăng nhập
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(!!getToken());
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Load dữ liệu sự kiện
  useEffect(() => {
    const data = getEventsData();
    setEvents(data.events || []);
  }, []);

  // Kiểm tra ngày sự kiện phải lớn hơn ngày hiện tại
  const isValidEventDate = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Xử lý thêm sự kiện mới
  const handleAddEvent = () => {
    if (!newEvent.tenSuKien || !newEvent.ngayToChuc) {
      alert('Vui lòng nhập tên sự kiện và ngày tổ chức!');
      return;
    }

    if (!isValidEventDate(newEvent.ngayToChuc)) {
      alert('Ngày tổ chức phải từ ngày hiện tại trở đi!');
      return;
    }

    const addedEvent = addEvent(newEvent);
    setEvents([...events, addedEvent]);
    setShowAddModal(false);
    setNewEvent({
      tenSuKien: '',
      ngayToChuc: '',
      moTa: ''
    });
  };

  // Xử lý cập nhật sự kiện
  const handleUpdateEvent = () => {
    if (!currentEvent.tenSuKien || !currentEvent.ngayToChuc) {
      alert('Vui lòng nhập tên sự kiện và ngày tổ chức!');
      return;
    }

    if (!isValidEventDate(currentEvent.ngayToChuc)) {
      alert('Ngày tổ chức phải từ ngày hiện tại trở đi!');
      return;
    }

    const updatedEvent = updateEvent(currentEvent.id, currentEvent);
    setEvents(events.map(event => event.id === currentEvent.id ? updatedEvent : event));
    setShowEditModal(false);
    setCurrentEvent(null);
  };

  // Xử lý xóa sự kiện
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      const result = deleteEvent(eventId);
      setEvents(result.events || []);
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Sắp xếp sự kiện theo ngày từ gần nhất
  const sortedEvents = [...events].sort((a, b) => new Date(a.ngayToChuc) - new Date(b.ngayToChuc));

  // Danh sách sự kiện sắp tới
  const upcomingEvents = sortedEvents.filter(event => new Date(event.ngayToChuc) >= new Date());

  return (
    <div className="container mt-4">
      <div className="event-management-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Quản lý sự kiện gia đình</h2>
          {isLoggedIn && (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setNewEvent({
                  tenSuKien: '',
                  ngayToChuc: '',
                  moTa: ''
                });
                setShowAddModal(true);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>Thêm sự kiện mới
            </button>
          )}
        </div>

        {/* Sự kiện sắp tới */}
        <div className="upcoming-events-section mb-5">
          <h3 className="mb-3">Sự kiện sắp tới</h3>
          {upcomingEvents.length === 0 ? (
            <div className="alert alert-info">Không có sự kiện nào sắp tới</div>
          ) : (
            <div className="row">
              {upcomingEvents.map(event => (
                <div key={event.id} className="col-md-4 mb-4">
                  <div className="card event-card h-100">
                    <div className="card-body">
                      <div className="event-date">
                        {formatDate(event.ngayToChuc)}
                      </div>
                      <h4 className="card-title mt-3">{event.tenSuKien}</h4>
                      <p className="card-text text-truncate">{event.moTa || "Không có mô tả"}</p>
                    </div>
                    <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => {
                          setCurrentEvent(event);
                          setShowViewModal(true);
                        }}
                      >
                        <i className="bi bi-eye me-1"></i>Xem
                      </button>
                      {isLoggedIn && (
                        <div>
                          <button 
                            className="btn btn-sm btn-outline-secondary me-2" 
                            onClick={() => {
                              setCurrentEvent({...event});
                              setShowEditModal(true);
                            }}
                          >
                            <i className="bi bi-pencil me-1"></i>Sửa
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <i className="bi bi-trash me-1"></i>Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tất cả sự kiện */}
        <div className="all-events-section">
          <h3 className="mb-3">Danh sách tất cả sự kiện</h3>
          {events.length === 0 ? (
            <div className="alert alert-info">Chưa có sự kiện nào</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>STT</th>
                    <th>Tên sự kiện</th>
                    <th>Ngày tổ chức</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEvents.map((event, index) => (
                    <tr key={event.id}>
                      <td>{index + 1}</td>
                      <td>{event.tenSuKien}</td>
                      <td>{formatDate(event.ngayToChuc)}</td>
                      <td className="text-truncate" style={{maxWidth: "250px"}}>{event.moTa || "Không có mô tả"}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1" 
                          onClick={() => {
                            setCurrentEvent(event);
                            setShowViewModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        {isLoggedIn && (
                          <>
                            <button 
                              className="btn btn-sm btn-outline-secondary me-1" 
                              onClick={() => {
                                setCurrentEvent({...event});
                                setShowEditModal(true);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm sự kiện */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm sự kiện mới</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="tenSuKien" className="form-label">Tên sự kiện <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="tenSuKien"
                    value={newEvent.tenSuKien}
                    onChange={(e) => setNewEvent({ ...newEvent, tenSuKien: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ngayToChuc" className="form-label">Ngày tổ chức <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    id="ngayToChuc"
                    min={new Date().toISOString().split('T')[0]}
                    value={newEvent.ngayToChuc}
                    onChange={(e) => setNewEvent({ ...newEvent, ngayToChuc: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="moTa" className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    id="moTa"
                    rows="3"
                    value={newEvent.moTa}
                    onChange={(e) => setNewEvent({ ...newEvent, moTa: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button type="button" className="btn btn-primary" onClick={handleAddEvent}>Thêm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa sự kiện */}
      {showEditModal && currentEvent && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sửa sự kiện</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editTenSuKien" className="form-label">Tên sự kiện <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    id="editTenSuKien"
                    value={currentEvent.tenSuKien}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, tenSuKien: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editNgayToChuc" className="form-label">Ngày tổ chức <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    id="editNgayToChuc"
                    min={new Date().toISOString().split('T')[0]}
                    value={currentEvent.ngayToChuc}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, ngayToChuc: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editMoTa" className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    id="editMoTa"
                    rows="3"
                    value={currentEvent.moTa || ''}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, moTa: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateEvent}>Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết sự kiện */}
      {showViewModal && currentEvent && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết sự kiện</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="event-detail">
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">Tên sự kiện:</div>
                    <div className="col-md-8">{currentEvent.tenSuKien}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">Ngày tổ chức:</div>
                    <div className="col-md-8">{formatDate(currentEvent.ngayToChuc)}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">Mô tả:</div>
                    <div className="col-md-8">{currentEvent.moTa || "Không có mô tả"}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 fw-bold">Ngày tạo:</div>
                    <div className="col-md-8">
                      {currentEvent.createdAt ? new Date(currentEvent.createdAt).toLocaleString('vi-VN') : "Không có thông tin"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Đóng</button>
                {isLoggedIn && (
                  <>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        setShowViewModal(false);
                        setCurrentEvent({...currentEvent});
                        setShowEditModal(true);
                      }}
                    >
                      Sửa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 