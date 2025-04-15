import { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';
import LoginForm from '../components/Login';
import RegisterForm from '../components/Register';
import './Home.css'; // CSS file cho trang Home

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(!!getToken());
    }, 300); // check mỗi 300ms
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="overlay"></div>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-7 hero-text">
              <h1 className="display-4 fw-bold text-white">Gia Phả Việt</h1>
              <p className="lead text-white mb-4">Lưu giữ và chia sẻ lịch sử gia đình bạn cho các thế hệ tương lai</p>
              <div className="hero-features mb-4">
                <div className="feature-item">
                  <i className="bi bi-diagram-3"></i>
                  <span>Tạo cây gia phả</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-people"></i>
                  <span>Quản lý thành viên</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-share"></i>
                  <span>Chia sẻ với người thân</span>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="auth-card card shadow">
                <div className="card-body p-4">
      {!isLoggedIn ? (
        <>
          {showRegister ? (
            <>
                          <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
              <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
                          <p className="text-center mt-3">
                Đã có tài khoản?{' '}
                            <button className="btn btn-link p-0" onClick={() => setShowRegister(false)}>
                  Đăng nhập
                </button>
              </p>
            </>
          ) : (
            <>
                          <h2 className="text-center mb-4">Đăng nhập</h2>
              <LoginForm onLoginSuccess={handleLoginSuccess} />
                          <p className="text-center mt-3">
                Chưa có tài khoản?{' '}
                            <button className="btn btn-link p-0" onClick={() => setShowRegister(true)}>
                  Đăng ký
                </button>
              </p>
            </>
          )}
        </>
      ) : (
                    <div className="text-center welcome-card">
                      <i className="bi bi-check-circle-fill text-success welcome-icon"></i>
                      <h2 className="my-3">Chào mừng bạn đã đăng nhập!</h2>
                      <p className="mb-4">Bạn có thể bắt đầu quản lý cây gia phả của mình.</p>
                      <a href="/family-tree" className="btn btn-primary">Đi đến cây gia phả</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần giới thiệu tính năng */}
      <div className="container my-5 py-4">
        <h2 className="text-center mb-5">Tính năng nổi bật</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 feature-card">
              <div className="card-body text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-diagram-3"></i>
                </div>
                <h3 className="card-title mt-4">Tạo cây gia phả</h3>
                <p className="card-text">Dễ dàng tạo và quản lý cây gia phả trực quan với giao diện kéo thả.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 feature-card">
              <div className="card-body text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-people"></i>
                </div>
                <h3 className="card-title mt-4">Quản lý thành viên</h3>
                <p className="card-text">Thêm và cập nhật thông tin chi tiết về mỗi thành viên trong gia đình.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 feature-card">
              <div className="card-body text-center p-4">
                <div className="feature-icon">
                  <i className="bi bi-share"></i>
                </div>
                <h3 className="card-title mt-4">Chia sẻ gia phả</h3>
                <p className="card-text">Dễ dàng chia sẻ cây gia phả với các thành viên khác trong gia đình.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần lời chứng thực */}
      <div className="testimonial-section py-5">
        <div className="container">
          <h2 className="text-center text-white mb-5">Người dùng nói gì về chúng tôi?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card testimonial-card">
                <div className="card-body p-4">
                  <p className="testimonial-text">"Ứng dụng giúp tôi lưu giữ thông tin gia đình một cách dễ dàng và trực quan."</p>
                  <div className="d-flex align-items-center mt-3">
                    <div className="testimonial-avatar">NT</div>
                    <div className="ms-3">
                      <h5 className="mb-0">Nguyễn Thành</h5>
                      <small className="text-muted">Hà Nội</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card testimonial-card">
                <div className="card-body p-4">
                  <p className="testimonial-text">"Giao diện đơn giản, dễ sử dụng. Tôi đã tạo được cây gia phả đầy đủ chỉ trong vài giờ."</p>
                  <div className="d-flex align-items-center mt-3">
                    <div className="testimonial-avatar">TH</div>
                    <div className="ms-3">
                      <h5 className="mb-0">Trần Hương</h5>
                      <small className="text-muted">TP.HCM</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card testimonial-card">
                <div className="card-body p-4">
                  <p className="testimonial-text">"Đây là công cụ tuyệt vời để gìn giữ lịch sử gia đình cho các thế hệ sau."</p>
                  <div className="d-flex align-items-center mt-3">
                    <div className="testimonial-avatar">LP</div>
                    <div className="ms-3">
                      <h5 className="mb-0">Lê Phương</h5>
                      <small className="text-muted">Đà Nẵng</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer mt-5 py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h4>Gia Phả Việt</h4>
              <p>Lưu giữ và chia sẻ lịch sử gia đình bạn</p>
            </div>
            <div className="col-md-3">
              <h5>Liên kết</h5>
              <ul className="list-unstyled">
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/family-tree">Cây gia phả</a></li>
                <li><a href="/profile">Tài khoản</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Liên hệ</h5>
              <ul className="list-unstyled">
                <li><i className="bi bi-envelope me-2"></i> votranthiet03022004@gmail.com</li>
                <li><i className="bi bi-telephone me-2"></i> 0942922440</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="mb-0">© 2025 Gia Phả Việt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
