import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../contexts/AuthContext';

import { useUI } from '../contexts/UIContext';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: 'customer',
    bank_name: '',
    bank_account_number: '',
    bank_account_holder: ''
  });
  const { user } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      showNotification('Dang ky tai khoan thanh cong! Vui long dang nhap de tiep tuc.', 'success');
      navigate('/login');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Dang ky that bai', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Tao tai khoan moi</h2>
        <p>Tham gia he thong de bat dau tim thue hoac ky gui bat dong san cua ban</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ho ten *</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="VD: Nguyen Van A" />
          </div>

          <div className="form-group">
            <label>Email lien he *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
          </div>

          <div className="form-group">
            <label>So dien thoai {form.role === 'landlord' ? '*' : ''}</label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} required={form.role === 'landlord'} placeholder="09xx xxx xxx" />
          </div>

          <div className="form-group">
            <label>Loai tai khoan *</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="customer">Khach thue</option>
              <option value="landlord">Chu nha ky gui</option>
            </select>
          </div>

          {form.role === 'landlord' && (
            <>
              <div className="form-group">
                <label>Ngan hang nhan tien *</label>
                <input name="bank_name" value={form.bank_name} onChange={handleChange} required placeholder="VD: Vietcombank" />
              </div>
              <div className="form-group">
                <label>So tai khoan *</label>
                <input name="bank_account_number" value={form.bank_account_number} onChange={handleChange} required placeholder="VD: 0123456789" />
              </div>
              <div className="form-group">
                <label>Chu tai khoan *</label>
                <input name="bank_account_holder" value={form.bank_account_holder} onChange={handleChange} required placeholder="Ten tren tai khoan ngan hang" />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Mat khau *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Toi thieu 6 ky tu" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            Xac nhan dang ky
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#718096' }}>
          Da co tai khoan? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Dang nhap ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
