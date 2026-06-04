import { useState, useEffect } from 'react';
import api, { createRentalContract, logInteraction, updateAppointment } from '../api';
import { X, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import { useUI } from '../contexts/UIContext';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [msgInput, setMsgInput] = useState({});
  const [proposeDate, setProposeDate] = useState({});
  const { showNotification } = useUI();
  const { user } = useAuth();
  
  const [contractForm, setContractForm] = useState({
    gia_tri_hop_dong: '',
    phan_tram_hoa_hong: 3,
    ngay_bat_dau: '',
    ngay_ket_thuc: ''
  });
  const [interactionText, setInteractionText] = useState('');

  const fetchAppointments = () => {
    api.get('/employee/appointments').then((r) => setAppointments(r.data?.data || [])).catch(() => {});
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = async (id, patch) => {
    try {
      await updateAppointment(id, patch);
      setMsgInput({ ...msgInput, [id]: '' });
      setProposeDate({ ...proposeDate, [id]: null });
      fetchAppointments();
      showNotification('Da cap nhat thong tin lich hen', 'success');
    } catch (e) {
      showNotification('Khong the cap nhat lich hen', 'error');
    }
  };

  const openWorkPanel = (appointment) => {
    setSelected(appointment);
    setContractForm({
      gia_tri_hop_dong: appointment.Property?.gia_de_xuat ? Number(appointment.Property.gia_de_xuat) * 12 : '',
      phan_tram_hoa_hong: 3,
      ngay_bat_dau: '',
      ngay_ket_thuc: ''
    });
    setInteractionText('');
  };

  const saveInteraction = async () => {
    if (!selected || !interactionText.trim()) return;
    try {
      await logInteraction({
        khach_hang_id: selected.khach_hang_id,
        nha_cho_thue_id: selected.nha_cho_thue_id,
        ngay_gio: new Date().toISOString(),
        noi_dung_trao_doi: interactionText,
        loai_trao_doi: 'meeting'
      });
      setInteractionText('');
      showNotification('Da luu lich su lam viec', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the luu lich su', 'error');
    }
  };

  const closeRentalContract = async () => {
    if (!selected) return;
    try {
      await createRentalContract({
        appointment_id: selected.id,
        khach_hang_id: selected.khach_hang_id,
        nha_cho_thue_id: selected.nha_cho_thue_id,
        ...contractForm
      });
      setSelected(null);
      fetchAppointments();
      showNotification('Da tao hop dong thue va tinh hoa hong thanh cong!', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the tao hop dong thue', 'error');
    }
  };

  const statusMap = {
    pending: { label: 'Ben kia de xuat/cho gui lich', color: '#ecc94b' },
    proposed: { label: 'Da gui lich - cho xac nhan', color: '#4299e1' },
    confirmed: { label: 'Da chot lich', color: '#48bb78' },
    rejected: { label: 'Ben kia tu choi', color: '#f56565' },
    completed: { label: 'Da xem xong', color: '#718096' },
    cancelled: { label: 'Da huy', color: '#a0aec0' }
  };
  const visibleAppointments = appointments.filter((appointment) => {
    if (appointment.loai_lich_hen === 'deposit_survey' && ['completed', 'cancelled', 'no_show'].includes(appointment.trang_thai)) {
      return false;
    }
    if (user?.role === 'broker') return appointment.loai_lich_hen !== 'deposit_survey';
    if (user?.role === 'staff') return appointment.loai_lich_hen === 'deposit_survey';
    return true;
  });
  const isDepositSurvey = (appointment) => appointment.loai_lich_hen === 'deposit_survey';
  const participantLabel = (appointment) => isDepositSurvey(appointment) ? 'Chu nha' : 'Khach hang';

  return (
    <div>
      <div className="topbar"><h1>{user?.role === 'staff' ? 'Quan ly lich hen khao sat' : 'Quan ly lich hen xem nha'}</h1></div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {visibleAppointments.map((a) => (
          <div key={a.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{a.User?.full_name}</h3>
                <p style={{ fontSize: '13px', color: '#718096', marginTop: 4 }}>SĐT: {a.User?.phone_number || '---'}</p>
              </div>
              <span className="badge" style={{ background: statusMap[a.trang_thai]?.color || '#edf2f7', color: '#fff' }}>
                {statusMap[a.trang_thai]?.label || a.trang_thai}
              </span>
            </div>

            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>{a.Property?.loai_nha}</p>
              <p style={{ fontSize: '13px', color: '#718096', marginTop: 4 }}>{a.Property?.dia_chi_chi_tiet}</p>
            </div>

            <div>
              <p style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Clock size={16} color="#3182ce" /> 
                <strong>Thoi gian:</strong> {a.ngay_gio ? new Date(a.ngay_gio).toLocaleString('vi-VN') : <span style={{ color: '#e53e3e', fontWeight: 700 }}>YEU CAU GUI LICH</span>}
              </p>
              {a.last_message && (
                <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #edf2f7', fontSize: '14px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase', marginBottom: 4 }}>
                    {a.last_message_by === 'customer' ? 'Khach hang' : 'Ban'} nhan:
                  </p>
                  {a.last_message}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
              {a.trang_thai === 'confirmed' && (
                isDepositSurvey(a) ? (
                  <div style={{ padding: 12, background: '#f0fff4', borderRadius: 12, color: '#2f855a', fontSize: 13, fontWeight: 600 }}>
                    Lịch khảo sát đã chốt. Sau khi gặp chủ nhà, cập nhật hiện trạng trong dashboard ký gửi.
                  </div>
                ) : ['broker', 'admin'].includes(user?.role) && (
                  <button className="btn btn-primary" style={{ justifyContent: 'center', height: 48 }} onClick={() => openWorkPanel(a)}>
                    Làm việc / Lập hợp đồng
                  </button>
                )
              )}

              {['pending', 'proposed', 'rejected'].includes(a.trang_thai) && (
                <>
                  {['pending', 'rejected'].includes(a.trang_thai) ? (
                    <button className="btn btn-primary" style={{ justifyContent: 'center', height: '48px' }} onClick={() => setProposeDate({...proposeDate, [a.id]: new Date().toISOString().slice(0, 16)})}>
                      <Calendar size={18} /> {a.ngay_gio ? `Gui lai lich hen cho ${participantLabel(a).toLowerCase()}` : `Gui lich hen cho ${participantLabel(a).toLowerCase()}`}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ padding: 12, background: '#ebf8ff', borderRadius: 12, color: '#2c5282', fontSize: 13, fontWeight: 600 }}>
                        Da gui lich hen. {participantLabel(a)} co the xac nhan hoac de xuat gio khac. Ban cung co the xac nhan lich nay de chuyen sang buoc tiep theo.
                      </div>
                      {a.ngay_gio && (
                        <button className="btn btn-success" style={{ justifyContent: 'center' }} onClick={() => handleAction(a.id, { trang_thai: 'confirmed', message: 'Nhan vien xac nhan lich hen nay.' })}>
                          Xac nhan lich nay
                        </button>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      placeholder={`Gui tin nhan cho ${participantLabel(a).toLowerCase()}...`} 
                      value={msgInput[a.id] || ''} 
                      onChange={(e) => setMsgInput({ ...msgInput, [a.id]: e.target.value })}
                      style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                    />
                    <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={() => handleAction(a.id, { message: msgInput[a.id] })}>
                      Gui
                    </button>
                  </div>

                  {proposeDate[a.id] && (
                    <div style={{ display: 'flex', gap: 8, padding: 12, background: '#ebf8ff', borderRadius: 12 }}>
                      <input type="datetime-local" value={proposeDate[a.id]} onChange={(e) => setProposeDate({...proposeDate, [a.id]: e.target.value})} style={{ flex: 1 }} />
                      <button className="btn btn-primary" onClick={() => handleAction(a.id, { ngay_gio: proposeDate[a.id], trang_thai: 'proposed', message: `${isDepositSurvey(a) ? 'Nhan vien van phong' : 'Moi gioi'} de xuat thoi gian hen moi.` })}>Luu</button>
                      <button className="btn" onClick={() => setProposeDate({...proposeDate, [a.id]: null})}>Huy</button>
                    </div>
                  )}
                  
                  {a.ngay_gio && !proposeDate[a.id] && a.trang_thai !== 'confirmed' && (
                    <button className="btn" style={{ border: '1px dashed #cbd5e0', justifyContent: 'center' }} onClick={() => setProposeDate({...proposeDate, [a.id]: new Date(a.ngay_gio).toISOString().slice(0, 16)})}>
                      <Calendar size={16} /> Doi thoi gian khac
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {visibleAppointments.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: 80, textAlign: 'center', background: '#fff', borderRadius: 20 }}>
            <Calendar size={48} color="#cbd5e0" style={{ marginBottom: 16 }} />
            <p style={{ color: '#718096', fontSize: '16px' }}>Hien tai chua co yeu cau xem nha nao.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal-content" style={{ maxWidth: '900px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2>Lam viec & Chot hop dong thue</h2>
              <button className="btn" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="stat-card" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', marginBottom: 16 }}>Nhat ky lam viec</h3>
                <div className="form-group">
                  <textarea rows="6" value={interactionText} onChange={(e) => setInteractionText(e.target.value)} placeholder="Ghi chu ket qua dan khach xem nha, cac thoa thuan them..." />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveInteraction}>Luu nhat ky</button>
              </div>

              <div className="stat-card" style={{ boxShadow: 'none', border: '1px solid #c6f6d5', background: '#f0fff4' }}>
                <h3 style={{ fontSize: '16px', marginBottom: 16 }}>Lap hop dong thue</h3>
                <div className="form-group">
                  <label>Tong gia tri hop dong (VNĐ)</label>
                  <input type="number" value={contractForm.gia_tri_hop_dong} onChange={(e) => setContractForm({ ...contractForm, gia_tri_hop_dong: e.target.value })} placeholder="VD: 120000000" />
                </div>
                <div className="form-group">
                  <label>Ti le hoa hong (%)</label>
                  <input type="number" value={contractForm.phan_tram_hoa_hong} onChange={(e) => setContractForm({ ...contractForm, phan_tram_hoa_hong: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label>Tu ngay</label><input type="date" value={contractForm.ngay_bat_dau} onChange={(e) => setContractForm({ ...contractForm, ngay_bat_dau: e.target.value })} /></div>
                  <div className="form-group"><label>Den ngay</label><input type="date" value={contractForm.ngay_ket_thuc} onChange={(e) => setContractForm({ ...contractForm, ngay_ket_thuc: e.target.value })} /></div>
                </div>
                <button className="btn btn-success" style={{ width: '100%', marginTop: 12, height: '48px' }} onClick={closeRentalContract}>
                  Xac nhan chot thue nha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointments;
