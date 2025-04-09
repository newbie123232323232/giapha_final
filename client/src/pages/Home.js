import { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';
import LoginForm from '../components/Login';
import RegisterForm from '../components/Register';

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
    <div className="container">
      {!isLoggedIn ? (
        <>
          {showRegister ? (
            <>
              <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
              <p className="text-center">
                Đã có tài khoản?{' '}
                <button className="btn btn-link" onClick={() => setShowRegister(false)}>
                  Đăng nhập
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLoginSuccess={handleLoginSuccess} />
              <p className="text-center">
                Chưa có tài khoản?{' '}
                <button className="btn btn-link" onClick={() => setShowRegister(true)}>
                  Đăng ký
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <div className="text-center">
          <h2>Chào mừng bạn đã đăng nhập!</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
