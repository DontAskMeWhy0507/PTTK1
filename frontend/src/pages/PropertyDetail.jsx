import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAppointment, getPropertyDetail } from '../api';
import { useAuth } from '../contexts/AuthContext';

const PropertyDetail = () => {
  const [property, setProperty] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getPropertyDetail(id)
      .then((res) => setProperty(res.data.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!date) {
      alert('Vui long chon ngay gio');
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment({ nha_cho_thue_id: id, ngay_gio: date });
      alert('Da dat lich xem nha');
      navigate('/appointments');
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the dat lich');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Dang tai...</div>;
  if (!property) return <div style={{ padding: 40 }}>Khong tim thay nha.</div>;

  return (
    <div>
      <div className="topbar">
        <h1>Chi tiet nha</h1>
        <button className="btn" onClick={() => navigate('/properties')}>Quay lai</button>
      </div>

      <div className="property-detail-layout">
        <div className="property-hero">
          <div className="property-hero-image">{property.loai_nha}</div>
          <div className="property-hero-body">
            <div className="badge badge-active">{property.thong_tin_day_du ? 'Thanh vien' : 'Tom tat cong khai'}</div>
            <h2>{property.loai_nha}</h2>
            <p className="detail-price">{Number(property.gia_de_xuat || 0).toLocaleString('vi-VN')}d / thang</p>
            <p>{property.thong_tin_day_du ? property.dia_chi_chi_tiet : property.mo_ta_tom_tat}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: 16 }}>Thong tin bat dong san</h3>
            <p><strong>Loai nha:</strong> {property.loai_nha}</p>
            <p><strong>Dien tich:</strong> {property.dien_tich || '---'} m2</p>
            <p><strong>Huong nha:</strong> {property.huong_nha || '---'}</p>
            <p><strong>So phong:</strong> {property.so_luong_phong || '---'}</p>
            <p><strong>Hien trang:</strong> {property.hien_trang || '---'}</p>
            <p><strong>Dia chi:</strong> {property.dia_chi_chi_tiet || '---'}</p>
            {!property.thong_tin_day_du && (
              <p style={{ color: '#c05621', marginTop: 12 }}>
                Chi tai khoan thanh vien moi xem duoc dia chi day du. Dang nhap tai khoan khach hang de mo khoa.
              </p>
            )}
          </div>

          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: 16 }}>Dat lich xem nha</h3>
            <div className="form-group">
              <label>Ngay gio</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button className="btn btn-primary" disabled={submitting} onClick={handleBook}>
              {submitting ? 'Dang gui...' : user ? 'Dat lich xem nha' : 'Dang nhap de dat lich'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
