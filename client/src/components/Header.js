import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 mb-4">
      <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Gia Phả
      </span>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {token && (
            <>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => navigate('/profile')}>
                  Tài khoản
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
