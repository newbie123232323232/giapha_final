import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <span className="navbar-brand" onClick={() => navigate('/')}>
          <i className="bi bi-diagram-3-fill me-2"></i>
          <span className="brand-text">Gia Phả Việt</span>
        </span>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link" onClick={() => navigate('/')}>Trang chủ</span>
            </li>
            
            {token && (
              <>
                <li className="nav-item">
                  <span className="nav-link" onClick={() => navigate('/family-tree')}>
                    <i className="bi bi-diagram-3 me-1"></i> Cây gia phả
                  </span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" onClick={() => navigate('/events')}>
                    <i className="bi bi-calendar-event me-1"></i> Sự kiện
                  </span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" onClick={() => navigate('/profile')}>
                    <i className="bi bi-person me-1"></i> Tài khoản
                  </span>
                </li>
                {/* Thêm nút Group Chat */}
                <li className="nav-item">
                  <span className="nav-link" onClick={() => navigate('/group-chat')}>
                    <i className="bi bi-chat me-1"></i> Group Chat
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
                  </button>
                </li>
              </>
            )}
            
            {!token && (
              <li className="nav-item">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
