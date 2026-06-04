import { useState, useEffect } from 'react';
import api, { updateAppointment } from '../api';
import { Check, X, MessageSquare, Clock, Calendar, User } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [msgInput, setMsgInput] = useState({});
  const [reschedule, setReschedule] = useState({});
  const { showNotification } = useUI();
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadAppointments = () => {
    api.get('/appointments/my').then((res) => setAppointments(res.data?.data || [])).catch(() => {});
  };

  useEffect(() => { loadAppointments(); }, []);

  const handleAction = async (id, patch) => {
    try {
      await updateAppointment(id, patch);
      setMsgInput({ ...msgInput, [id]: '' });
      setReschedule({ ...reschedule, [id]: null });
      showNotification('Da cap nhat thong tin lich hen', 'success');
      loadAppointments();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Co loi xay ra', 'error');
    }
  };

  const statusMap = {
    pending: { label: 'Dang cho phan hoi', color: '#ecc94b' },
    proposed: { label: 'Moi gioi de xuat lich moi', color: '#4299e1' },
    confirmed: { label: 'Da chot lich', color: '#48bb78' },
    rejected: { label: 'Ban da tu choi', color: '#f56565' },
    completed: { label: 'Da xem nha', color: '#718096' },
    cancelled: { label: 'Da huy', color: '#a0aec0' }
  };

  const isDepositSurvey = (appointment) => appointment.loai_lich_hen === 'deposit_survey';
  const isEditable = (appointment) => ['pending', 'proposed', 'rejected'].includes(appointment.trang_thai);

  return (
    <div>
      <div className="topbar">
        <h1>{user?.role === 'landlord' ? 'Lich hen khao sat ky gui' : 'Lich hen xem nha cua toi'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: 24 }}>
        {appointments.map((a) => (
          <div key={a.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{isDepositSurvey(a) ? 'Khao sat nha ky gui' : a.Property?.loai_nha}</h3>
                <p style={{ fontSize: '13px', color: '#718096', marginTop: 4 }}>{a.Property?.dia_chi_chi_tiet}</p>
              </div>
              <span className="badge" style={{ background: statusMap[a.trang_thai]?.color || '#edf2f7', color: '#fff' }}>
                {statusMap[a.trang_thai]?.label || a.trang_thai}
              </span>
            </div>

            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Clock size={16} color="#3182ce" /> <strong>Thoi gian hen:</strong> {a.ngay_gio ? new Date(a.ngay_gio).toLocaleString('vi-VN') : 'Dang cho de xuat'}
              </p>
              <p style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8, color: '#4a5568' }}>
                <User size={16} color="#38a169" /> <strong>{isDepositSurvey(a) ? 'Nhan vien phu trach:' : 'Moi gioi:'}</strong> {a.Broker?.full_name || 'Dang phan cong...'}
              </p>
              {a.Broker && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>
                  <div>{isDepositSurvey(a) ? 'SDT nhan vien:' : 'SDT moi gioi:'} <strong>{a.Broker.phone_number || 'Chua cap nhat'}</strong></div>
                  <div>{isDepositSurvey(a) ? 'Email nhan vien:' : 'Email moi gioi:'} <strong>{a.Broker.email || 'Chua cap nhat'}</strong></div>
                </div>
              )}
            </div>

            {a.last_message && (
              <div style={{ background: '#ebf8ff', padding: '12px', borderRadius: '10px', borderLeft: `4px solid ${['staff', 'broker'].includes(a.last_message_by) ? '#4299e1' : '#cbd5e0'}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2c5282', textTransform: 'uppercase', marginBottom: 4 }}>
                  Tin nhan cuoi cung ({['staff', 'broker'].includes(a.last_message_by) ? 'Nhan vien / Moi gioi' : 'Ban'}):
                </p>
                <p style={{ fontSize: '14px', color: '#2c5282' }}>{a.last_message}</p>
              </div>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {a.trang_thai === 'proposed' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleAction(a.id, { trang_thai: 'confirmed', message: 'Toi dong y voi thoi gian nay.' })}>
                    <Check size={16} /> {isDepositSurvey(a) ? 'Xac nhan lich' : 'Dong y lich moi'}
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleAction(a.id, { trang_thai: 'rejected', message: 'Thoi gian nay khong tien cho toi.' })}>
                    <X size={16} /> Tu choi
                  </button>
                </div>
              )}

              {isEditable(a) && (
                <>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                      placeholder="Gui tin nhan trao doi..." 
                      value={msgInput[a.id] || ''} 
                      onChange={(e) => setMsgInput({ ...msgInput, [a.id]: e.target.value })}
                      style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                    />
                    <button className="btn btn-primary" onClick={() => handleAction(a.id, { message: msgInput[a.id] })}>
                      <MessageSquare size={16} /> Gui
                    </button>
                  </div>
                  
                  {reschedule[a.id] ? (
                    <div style={{ display: 'flex', gap: 10, padding: 12, background: '#fefcbf', borderRadius: 12 }}>
                      <input type="datetime-local" value={reschedule[a.id]} onChange={(e) => setReschedule({...reschedule, [a.id]: e.target.value})} style={{ flex: 1 }} />
                      <button className="btn btn-primary" onClick={() => handleAction(a.id, { ngay_gio: reschedule[a.id], trang_thai: 'pending', message: 'Toi muon doi sang gio nay.' })}>Luu</button>
                      <button className="btn" onClick={() => setReschedule({...reschedule, [a.id]: null})}>Huy</button>
                    </div>
                  ) : (
                    <button className="btn" style={{ border: '1px dashed #cbd5e0', justifyContent: 'center' }} onClick={() => setReschedule({...reschedule, [a.id]: a.ngay_gio ? new Date(a.ngay_gio).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)})}>
                      <Calendar size={16} /> De xuat gio khac
                    </button>
                  )}
                </>
              )}
              
              {a.trang_thai === 'confirmed' && (
                <div style={{ padding: 12, background: '#f0fff4', borderRadius: 12, color: '#2f855a', fontSize: 13, fontWeight: 600 }}>
                  Lich hen da duoc chot. Neu can thay doi, vui long lien he truc tiep moi gioi phu trach.
                </div>
              )}

              {['pending'].includes(a.trang_thai) && (
                <button className="btn" style={{ color: '#e53e3e', padding: 0, justifyContent: 'flex-end', fontSize: '13px' }} onClick={() => handleAction(a.id, { trang_thai: 'cancelled', message: `${isDepositSurvey(a) ? 'Chu nha' : 'Khach hang'} da huy lich hen.` })}>
                  Huy lich hen nay
                </button>
              )}
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '100px 20px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e0' }}>
            <Calendar size={64} color="#cbd5e0" style={{ marginBottom: 20 }} />
            <h3 style={{ color: '#4a5568' }}>Ban chua co lich hen nao</h3>
            <p style={{ marginTop: 12, color: '#718096' }}>{user?.role === 'landlord' ? 'Khi nhan vien gui lich khao sat, lich se hien thi tai day.' : 'Hay kham pha cac bat dong san va gui yeu cau xem nha.'}</p>
            {user?.role !== 'landlord' && <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/properties')}>Tim nha ngay</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
