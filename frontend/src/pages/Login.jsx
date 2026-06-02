import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      loginUser(res.data.user, res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Dang nhap that bai');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Dang nhap</h2>
        <p>He thong quan ly ky gui va cho thue nha</p>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mat khau</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Dang nhap
          </button>
        </form>
        {!user && (
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            Chua co tai khoan? <Link to="/register" style={{ color: '#3182ce' }}>Dang ky khach hang</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
