import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDepositRequest } from '../api';
import { CheckCircle } from 'lucide-react';

import { useUI } from '../contexts/UIContext';

const DepositRequest = () => {
  const [form, setForm] = useState({ loai_nha: '', dien_tich: '', huong_nha: '', so_luong_phong: 1, dia_chi_chi_tiet: '', gia_de_xuat: '', hien_trang: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useUI();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createDepositRequest(form);
      setSuccess(true);
      showNotification(res.data.message || 'Gui yeu cau ky gui thanh cong', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', background: '#fff', borderRadius: '40px', boxShadow: 'var(--shadow-lg)', maxWidth: '650px', margin: '60px auto', border: '1px solid rgba(0,0,0,0.03)' }}>
        <div style={{ width: '100px', height: '100px', background: '#f0fff4', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', transform: 'rotate(-10deg)' }}>
          <CheckCircle size={56} color="#38a169" />
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a202c', letterSpacing: '-0.5px' }}>Yeu cau ky gui thanh cong!</h2>
        <p style={{ color: '#718096', margin: '16px 0 48px', lineHeight: 1.8, fontSize: '16px' }}>
          Yeu cau cua ban da duoc he thong ghi nhan. Nhan vien dai ly se lien he qua so dien thoai de sap xep lich gap, danh gia hien trang va thong nhat hop tac truoc khi ky ket hop dong.
        </p>
        <button className="btn btn-primary" style={{ height: '56px', padding: '0 48px', borderRadius: '18px' }} onClick={() => navigate('/landlord')}>Quay ve Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <div className="topbar"><h1>Ky gui bat dong san cho thue</h1></div>
      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 2 }}></div>
          <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Thong tin bat dong san</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Loại nhà *</label>
              <select name="loai_nha" value={form.loai_nha} onChange={handleChange} required>
                <option value="">-- Chọn loại nhà --</option>
                <option value="Căn hộ chung cư">Căn hộ chung cư</option>
                <option value="Nhà riêng">Nhà riêng</option>
                <option value="Studio">Studio</option>
                <option value="Phòng trọ">Phòng trọ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Diện tích (m²)</label>
              <input type="number" name="dien_tich" value={form.dien_tich} onChange={handleChange} placeholder="VD: 75" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hướng nhà</label>
              <select name="huong_nha" value={form.huong_nha} onChange={handleChange}>
                <option value="">-- Chọn hướng --</option>
                <option value="Đông">Đông</option>
                <option value="Tây">Tây</option>
                <option value="Nam">Nam</option>
                <option value="Bắc">Bắc</option>
                <option value="Đông Nam">Đông Nam</option>
              </select>
            </div>
            <div className="form-group">
              <label>Số phòng ngủ</label>
              <input type="number" name="so_luong_phong" value={form.so_luong_phong} onChange={handleChange} min="1" />
            </div>
          </div>

          <div className="form-group">
            <label>Địa chỉ chính xác *</label>
            <input type="text" name="dia_chi_chi_tiet" value={form.dia_chi_chi_tiet} onChange={handleChange} required placeholder="VD: 123 Đường Láng, Đống Đa, Hà Nội" />
          </div>
          
          <div className="form-group">
            <label>Giá đề xuất cho thuê (VNĐ/tháng)</label>
            <input type="number" name="gia_de_xuat" value={form.gia_de_xuat} onChange={handleChange} placeholder="VD: 12000000" />
          </div>
          
          <div className="form-group">
            <label>Hiện trạng & Phap ly</label>
            <textarea name="hien_trang" value={form.hien_trang} onChange={handleChange} placeholder="VD: Mới bàn giao, đầy đủ nội thất cơ bản, co so do..." rows="4" />
          </div>

          <div style={{ padding: '20px', background: '#ebf8ff', borderRadius: '16px', border: '1px solid #bee3f8', marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', color: '#2c5282', lineHeight: 1.6 }}>
              <strong>Lưu ý:</strong> Sau khi gửi thông tin, ban cần nộp khoản tiền đảm bảo là <strong>1.000.000 VNĐ</strong> để kích hoạt dịch vụ tìm khách thuê.
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '16px', borderRadius: '18px' }} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác nhận gửi thông tin ký gửi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositRequest;
