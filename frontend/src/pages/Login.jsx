import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../contexts/AuthContext';

import { useUI } from '../contexts/UIContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, loginUser } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      loginUser(res.data.user, res.data.token);
      showNotification('Dang nhap thanh cong', 'success');
      navigate('/');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Dang nhap that bai', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Chao mung tro lai</h2>
        <p>Dang nhap vao he thong de bat dau tim thue hoac ky gui bat dong san cua ban</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email lien he</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
          </div>
          
          <div className="form-group">
            <label>Mat khau truy cap</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Dang nhap vao he thong
          </button>
        </form>

        {!user && (
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#718096' }}>
            Chua co tai khoan? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Dang ky ngay</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
