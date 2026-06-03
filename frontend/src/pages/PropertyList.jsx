import { useState, useEffect, useCallback } from 'react';
import api, { getProperties } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, X, Home } from 'lucide-react';

import { useUI } from '../contexts/UIContext';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const [myAppointments, setMyAppointments] = useState([]);
  const { user } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    try {
      const res = await getProperties({ q: search || undefined });
      setProperties(res.data?.data || []);
    } catch (err) {
      console.error('Loi tai danh sach nha:', err);
    }
  }, [search]);

  const fetchAppointments = useCallback(async () => {
    if (user?.role === 'customer') {
      try {
        const res = await api.get('/appointments/my');
        setMyAppointments(res.data?.data || []);
      } catch (e) {}
    }
  }, [user]);

  useEffect(() => { 
    fetchProperties(); 
    fetchAppointments();
  }, [fetchProperties, fetchAppointments]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const [booking, setBooking] = useState(null);
  const [date, setDate] = useState('');

  const handleBook = async () => {
    try {
      await api.post('/appointments', { nha_cho_thue_id: booking.id, ngay_gio: date, ghi_chu: 'Khach hang muon xem nha nay' });
      showNotification('Da gui yeu cau xem nha thanh cong!', 'success');
      setBooking(null);
    } catch (err) {
      showNotification('Loi gui yeu cau xem nha', 'error');
    }
  };

  return (
    <div>
      {booking && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setBooking(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '20px' }}>Hen xem nha</h3>
              <button className="btn" onClick={() => setBooking(null)}><X size={20} /></button>
            </div>
            <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '12px', marginBottom: 20 }}>
              <p style={{ fontWeight: 700, color: '#2d3748' }}>{booking.loai_nha}</p>
              <p style={{ fontSize: '13px', color: '#718096', marginTop: 4 }}>{booking.dien_tich} m²</p>
            </div>
            <div className="form-group">
              <label>Thoi gian ban muon xem (du kien)</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required style={{ height: '48px' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: 24 }}>
              <button className="btn btn-primary" style={{ flex: 1, height: '44px' }} onClick={handleBook}>Xac nhan gui</button>
              <button className="btn" style={{ flex: 1, height: '44px', border: '1px solid #e2e8f0' }} onClick={() => setBooking(null)}>Huy</button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <h1>Kham pha bat dong san</h1>
        {!user && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Dang nhap</button>
            <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate('/register')}>Dang ky</button>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '40px', maxWidth: '800px' }}>
        <input
          type="text"
          placeholder="Tim theo dia chi, loai nha (chung cu, nha rieng...)"
          style={{ width: '100%', padding: '18px 24px 18px 56px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '16px', boxShadow: 'var(--shadow)' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={22} color="#a0aec0" style={{ position: 'absolute', left: '20px', top: '18px' }} />
        <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '8px', top: '8px', height: '42px' }}>Tim kiem</button>
      </form>

      {properties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 20px', background: '#fff', borderRadius: '20px', border: '1px dashed #cbd5e0' }}>
          <Search size={64} color="#cbd5e0" style={{ marginBottom: 20 }} />
          <h3 style={{ fontSize: '20px', color: '#4a5568' }}>Khong tim thay nha phu hop</h3>
          <p style={{ marginTop: 12, color: '#718096' }}>Hay thu thay doi tu khoa tim kiem hoac dang nhap de xem cac nha moi nhat.</p>
        </div>
      )}

      <div className="property-grid">
        {properties.map((p) => {
          const isOwner = user?.id === p.chu_nha_id;
          const appt = myAppointments.find(a => a.nha_cho_thue_id === p.id && ['pending', 'proposed', 'confirmed'].includes(a.trang_thai));
          const hasAppt = !!appt;
          
          return (
          <div key={p.id} className="property-card" style={isOwner ? { border: '2px solid #ecc94b', background: '#fffff0' } : {}}>
            <div className="img" style={{ background: isOwner ? 'linear-gradient(135deg, #fefcbf, #fbd38d)' : 'linear-gradient(135deg, #ebf8ff, #bee3f8)' }}>
              <Home size={48} color={isOwner ? "#d69e2e" : "#3182ce"} />
            </div>
            <div className="body">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <span className="badge badge-active">{p.loai_nha}</span>
                {isOwner && <span className="badge" style={{ background: '#ecc94b', color: '#744210' }}>Nha cua ban</span>}
                {hasAppt && (
                  <span className="badge" style={{ background: '#4299e1', color: '#fff' }}>
                    Da phan cho: {appt.Broker?.full_name || 'Dang tim...'}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '18px', color: '#1a202c', marginBottom: 8 }}>{p.loai_nha} - {p.dien_tich}m²</h3>
              <p className="address" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', color: '#718096', marginBottom: 16 }}>
                <MapPin size={16} /> {p.dia_chi_chi_tiet}
              </p>
              
              <div style={{ marginTop: 'auto' }}>
                <div className="price" style={{ color: isOwner ? '#d69e2e' : 'var(--primary)' }}>{Number(p.gia_de_xuat).toLocaleString('vi-VN')} VNĐ/tháng</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  {(!isOwner && !hasAppt && (!user || user.role === 'customer')) && (
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: '13px', padding: '10px' }}
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        setBooking(p);
                      }}
                    >
                      Hen xem nha
                    </button>
                  )}
                  <button
                    className="btn"
                    style={{ flex: (!isOwner && !hasAppt && (!user || user.role === 'customer')) ? 'unset' : 1, border: '1px solid #e2e8f0', fontSize: '13px', padding: '10px' }}
                    onClick={() => navigate(`/properties/${p.id}`)}
                  >
                    Chi tiet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>

      {properties.length > 0 && !user && (
        <div style={{ marginTop: '60px', background: 'linear-gradient(135deg, #3182ce, #2c5282)', padding: '48px', borderRadius: '24px', textAlign: 'center', color: '#fff', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Xem thong tin day du & Dat lich?</h2>
          <p style={{ margin: '16px 0 32px', fontSize: '16px', opacity: 0.9 }}>Dang nhap hoac dang ky ngay de xem dia chi chinh xac va ket noi truc tiep voi moi gioi.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn" style={{ background: '#fff', color: '#2c5282', padding: '14px 32px' }} onClick={() => navigate('/login')}>Dang nhap ngay</button>
            <button className="btn" style={{ border: '1px solid rgba(255,255,255,0.4)', color: '#fff', padding: '14px 32px' }} onClick={() => navigate('/register')}>Tao tai khoan moi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
