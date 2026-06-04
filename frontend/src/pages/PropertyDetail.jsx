import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { createAppointment, getPropertyDetail } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Home } from 'lucide-react';

import { useUI } from '../contexts/UIContext';

const PropertyDetail = () => {
  const [property, setProperty] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeAppt, setActiveAppt] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();
  const brokerContact = activeAppt?.Broker || property?.Broker;

  useEffect(() => {
    getPropertyDetail(id)
      .then((res) => setProperty(res.data.data))
      .catch(() => setProperty(null))
      .finally(() => setLoading(false));

    if (user?.role === 'customer') {
      api.get('/appointments/my').then((res) => {
        const found = res.data?.data?.find(a => a.nha_cho_thue_id === id && ['pending', 'proposed', 'confirmed'].includes(a.trang_thai));
        setActiveAppt(found || null);
      }).catch(() => {});
    }
  }, [id, user]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      showNotification('Chuc nang dat lich xem nha chi danh cho Thanh vien (Khach hang)', 'error');
      return;
    }

    if (user?.id && property.chu_nha_id && user.id === property.chu_nha_id) {
      showNotification('Ban khong the dat lich xem chinh nha minh dang', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await createAppointment({ nha_cho_thue_id: id, ghi_chu: 'Khach hang muon hen xem nha nay' });
      showNotification('Da gui yeu cau xem nha! Moi gioi se lien he va gui lich hen cho ban som.', 'success');
      navigate('/appointments');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the gui yeu cau', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Dang tai thong tin...</div>;
  if (!property) return <div style={{ padding: 60, textAlign: 'center' }}>Khong tim thay bat dong san nay.</div>;

  return (
    <div>
      <div className="topbar">
        <h1>Chi tiet bat dong san</h1>
        <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate('/properties')}>Quay lai</button>
      </div>

      <div className="property-detail-layout">
        <div className="property-hero">
          <div className="property-hero-image" style={{ background: 'linear-gradient(135deg, #3182ce, #63b3ed)' }}>
            <Home size={64} color="#fff" />
          </div>
          <div className="property-hero-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className={`badge ${property.thong_tin_day_du ? 'badge-active' : 'badge-pending'}`} style={{ marginBottom: 12 }}>
                  {property.thong_tin_day_du ? 'Thanh vien - Xem day du' : 'Khach vang lai - Xem tom tat'}
                </span>
                <h2 style={{ fontSize: '28px', color: '#1a202c' }}>{property.loai_nha}</h2>
              </div>
              <div className="detail-price">{Number(property.gia_de_xuat || 0).toLocaleString('vi-VN')} VNĐ/tháng</div>
            </div>
            <p style={{ marginTop: 16, fontSize: '16px', color: '#4a5568' }}>
              {property.thong_tin_day_du ? property.dia_chi_chi_tiet : property.mo_ta_tom_tat}
            </p>
          </div>
        </div>

        <div className="detail-grid">
          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: 20, fontSize: '18px', borderBottom: '1px solid #edf2f7', paddingBottom: 12 }}>
              Thong tin chi tiet
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <p><strong>Loai nha:</strong><br/> {property.loai_nha}</p>
              <p><strong>Dien tich:</strong><br/> {property.dien_tich || '---'} m²</p>
              <p><strong>Huong nha:</strong><br/> {property.huong_nha || '---'}</p>
              <p><strong>So phong ngu:</strong><br/> {property.so_luong_phong || '---'}</p>
              <p><strong>Hien trang:</strong><br/> {property.hien_trang || '---'}</p>
              <p><strong>Dia chi:</strong><br/> {property.dia_chi_chi_tiet || '---'}</p>
            </div>
            {!property.thong_tin_day_du && (
              <div style={{ marginTop: 24, padding: 16, background: '#fffaf0', borderRadius: 12, border: '1px solid #feebc8', color: '#744210', fontSize: '14px' }}>
                Ban dang xem ban tom tat. Dang nhap tai khoan khach hang de mo khoa dia chi chinh xac va thong tin lien he.
              </div>
            )}
            {property.thong_tin_day_du && brokerContact && (
              <div style={{ marginTop: 24, padding: 16, background: '#f0fff4', borderRadius: 12, border: '1px solid #c6f6d5', color: '#22543d', fontSize: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Moi gioi phu trach</div>
                <div>Ho ten: <strong>{brokerContact.full_name || 'Dang cap nhat'}</strong></div>
                <div>So dien thoai: <strong>{brokerContact.phone_number || 'Chua cap nhat'}</strong></div>
                <div>Email: <strong>{brokerContact.email || 'Chua cap nhat'}</strong></div>
              </div>
            )}
          </div>

          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: 20, fontSize: '18px', borderBottom: '1px solid #edf2f7', paddingBottom: 12 }}>
              Dat lich xem nha
            </h3>
            
            {user?.role && user.role !== 'customer' ? (
              <div style={{ padding: '24px', background: '#f7fafc', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e0' }}>
                <p style={{ color: '#4a5568', fontWeight: 600 }}>Tai khoan cua ban ({user?.role}) khong co quyen dat lich xem nha.</p>
                <p style={{ color: '#718096', fontSize: '14px', marginTop: 8 }}>Chuc nang nay chi danh rieng cho Thanh vien (Khach hang).</p>
              </div>
            ) : user?.id && property.chu_nha_id && user.id === property.chu_nha_id ? (
              <div style={{ padding: '24px', background: '#ebf8ff', borderRadius: '16px', textAlign: 'center', border: '1px solid #bee3f8' }}>
                <p style={{ color: '#2c5282', fontWeight: 600 }}>Day la bat dong san cua chinh ban.</p>
                <p style={{ color: '#3182ce', fontSize: '14px', marginTop: 8 }}>Ban khong the tu dat lich xem nha minh dang ky gui.</p>
              </div>
            ) : activeAppt ? (
              <div style={{ padding: '24px', background: '#f0fff4', borderRadius: '16px', textAlign: 'center', border: '1px solid #c6f6d5' }}>
                <p style={{ color: '#22543d', fontWeight: 600 }}>Ban da gui yeu cau xem nha nay.</p>
                <div style={{ margin: '12px 0', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid #c6f6d5' }}>
                   <p style={{ fontSize: '13px', color: '#718096' }}>Moi gioi phu trach:</p>
                   <p style={{ fontWeight: 700, color: '#2f855a' }}>{activeAppt.Broker?.full_name || 'Dang tim...'}</p>
                   {activeAppt.Broker && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#4a5568' }}>
                      <div>SDT: <strong>{activeAppt.Broker.phone_number || 'Chua cap nhat'}</strong></div>
                      <div>Email: <strong>{activeAppt.Broker.email || 'Chua cap nhat'}</strong></div>
                    </div>
                   )}
                </div>
                <p style={{ color: '#2f855a', fontSize: '14px' }}>Vui long theo doi tai muc <strong>"Lich hen xem nha"</strong> de biet thong tin xac nhan.</p>
              </div>
            ) : (
              <>
                <p style={{ color: '#718096', fontSize: '14px', marginBottom: 20, textAlign: 'center' }}>
                  He thong se tu dong phan cong moi gioi phu trach de lien he va sap xep lich hen phu hop voi ban.
                </p>
                <button className="btn btn-primary" style={{ width: '100%', height: '52px', marginTop: 8 }} disabled={submitting} onClick={handleBook}>
                  {submitting ? 'Dang gui yeu cau...' : user ? 'Gui yeu cau xem nha nay' : 'Dang nhap de gui yeu cau'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
