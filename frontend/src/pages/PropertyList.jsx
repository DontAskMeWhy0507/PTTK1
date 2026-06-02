import { useState, useEffect, useCallback } from 'react';
import api, { getProperties } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    try {
      const res = await getProperties({ q: search || undefined });
      setProperties(res.data || []);
    } catch (err) {
      console.error('Loi tai danh sach nha:', err);
    }
  }, [search]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const [booking, setBooking] = useState(null);
  const [date, setDate] = useState('');

  const handleBook = async () => {
    try {
      await api.post('/appointments', { nha_cho_thue_id: booking.id, ngay_gio: date });
      alert('Da dat lich hen! Nhan vien se lien he ban.');
      setBooking(null);
    } catch (err) {
      alert('Loi dat lich');
    }
  };

  return (
    <div>
      {booking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="form-card" style={{ width: '400px' }}>
            <h3>Dat lich xem nha</h3>
            <p style={{ margin: '10px 0', fontSize: '14px' }}>{booking.loai_nha} - {booking.dien_tich}m2</p>
            <div className="form-group">
              <label>Chon ngay gio</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleBook}>Xac nhan</button>
              <button className="btn" style={{ flex: 1, border: '1px solid #cbd5e0' }} onClick={() => setBooking(null)}>Huy</button>
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <h1>Kham pha nha cho thue</h1>
        {!user && (
          <div>
            <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ marginRight: 8 }}>Dang nhap</button>
            <button className="btn btn-success" onClick={() => navigate('/register')}>Dang ky</button>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Tim theo khu vuc, loai nha..."
          style={{ width: '100%', padding: '16px 48px', borderRadius: '30px', border: '1px solid #cbd5e0', fontSize: '16px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" style={{ position: 'absolute', left: '16px', top: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <Search size={20} color="#718096" />
        </button>
      </form>

      {properties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0aec0' }}>
          <Search size={48} style={{ marginBottom: 16 }} />
          <h3>Khong tim thay nha nao</h3>
          <p style={{ marginTop: 8 }}>Hay thu tim kiem voi tu khoa khac hoac dang nhap de xem them.</p>
        </div>
      )}

      <div className="property-grid">
        {properties.map((p) => (
          <div key={p.id} className="property-card">
            <div className="img">Nha {p.loai_nha}</div>
            <div className="body">
              <div className="badge badge-active" style={{ marginBottom: 8 }}>{p.loai_nha}</div>
              <h3>{p.loai_nha} - {p.dien_tich}m2</h3>
              <p className="address">
                <MapPin size={14} style={{ verticalAlign: 'middle' }} /> {p.dia_chi_chi_tiet}
              </p>
              {!p.thong_tin_day_du && (
                <p style={{ fontSize: '12px', color: '#e53e3e', marginBottom: 4 }}>
                  Dang ky thanh vien de xem dia chi day du
                </p>
              )}
              <div className="price">{Number(p.gia_de_xuat).toLocaleString('vi-VN')}d / thang</div>
              <button
                className="btn btn-sm"
                style={{ width: '100%', marginTop: '12px', border: '1px solid #cbd5e0', background: '#fff' }}
                onClick={() => navigate(`/properties/${p.id}`)}
              >
                Xem chi tiet
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  setBooking(p);
                }}
              >
                {user ? 'Dat lich xem nha' : 'Dang nhap de dat lich'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {properties.length > 0 && !user?.is_member && (
        <div style={{ marginTop: '40px', background: '#ebf8ff', padding: '32px', borderRadius: '16px', border: '1px solid #bee3f8', textAlign: 'center' }}>
          <h2 style={{ color: '#2c5282' }}>Tro thanh thanh vien ngay!</h2>
          <p style={{ color: '#2c5282', margin: '8px 0 20px' }}>Chi thanh vien moi co the xem dia chi chi tiet va thong tin day du hon.</p>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Dang ky thanh vien</button>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
