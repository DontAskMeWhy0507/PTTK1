import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDepositRequest } from '../api';
import { CheckCircle } from 'lucide-react';

const DepositRequest = () => {
  const [form, setForm] = useState({ loai_nha: '', dien_tich: '', huong_nha: '', so_luong_phong: 1, dia_chi_chi_tiet: '', gia_de_xuat: '', hien_trang: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDepositRequest(form);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <CheckCircle size={64} color="#38a169" />
        <h2 style={{ marginTop: '20px' }}>Yêu cầu ký gửi thành công!</h2>
        <p style={{ color: '#718096', margin: '12px 0 24px' }}>Vui lòng nộp 1.000.000 VNĐ tiền đảm bảo để kích hoạt hợp đồng.</p>
        <button className="btn btn-primary" onClick={() => navigate('/landlord')}>Quay về Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <div className="topbar"><h1>Ký gửi nhà cho thuê</h1></div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <label>Địa chỉ *</label>
            <input type="text" name="dia_chi_chi_tiet" value={form.dia_chi_chi_tiet} onChange={handleChange} required placeholder="VD: 123 Đường Láng, Hà Nội" />
          </div>
          <div className="form-group">
            <label>Giá đề xuất (VNĐ/tháng)</label>
            <input type="number" name="gia_de_xuat" value={form.gia_de_xuat} onChange={handleChange} placeholder="VD: 12000000" />
          </div>
          <div className="form-group">
            <label>Hiện trạng</label>
            <input type="text" name="hien_trang" value={form.hien_trang} onChange={handleChange} placeholder="VD: Mới bàn giao, full nội thất" />
          </div>
          <p style={{ fontSize: '13px', color: '#718096', marginBottom: '16px' }}>
            Khi gửi yêu cầu, bạn đồng ý với các điều khoản ký gửi. Tiền đảm bảo: <strong>1.000.000 VNĐ</strong>.
          </p>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu ký gửi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositRequest;
