import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone_number: '' });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Dang ky that bai');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Dang ky khach hang</h2>
        <p>Tao tai khoan de xem chi tiet nha va dat lich xem nha</p>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ho ten *</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>So dien thoai</label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Mat khau *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Dang ky</button>
        </form>
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          Da co tai khoan? <Link to="/login" style={{ color: '#3182ce' }}>Dang nhap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
