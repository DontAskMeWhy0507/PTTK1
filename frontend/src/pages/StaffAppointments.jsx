import { useState, useEffect } from 'react';
import api, { createRentalContract, logInteraction } from '../api';
import { Check, X } from 'lucide-react';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
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

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/employee/appointments/${id}`, { trang_thai: status });
      fetchAppointments();
    } catch (e) {
      alert('Loi cap nhat');
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
      alert('Da luu lich su lam viec');
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the luu lich su');
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
      alert('Da tao hop dong thue va tinh hoa hong');
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the tao hop dong thue');
    }
  };

  return (
    <div>
      <div className="topbar"><h1>Quan ly lich hen</h1></div>
      <div className="table-container">
        <table>
          <thead><tr><th>Khach hang</th><th>Nha</th><th>Ngay gio</th><th>Trang thai</th><th>Thao tac</th></tr></thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.User?.full_name || '---'}</td>
                <td>{a.Property?.dia_chi_chi_tiet || '---'}</td>
                <td>{a.ngay_gio ? new Date(a.ngay_gio).toLocaleString('vi-VN') : '---'}</td>
                <td><span className={`badge badge-${a.trang_thai === 'confirmed' || a.trang_thai === 'completed' ? 'active' : 'pending'}`}>{a.trang_thai}</span></td>
                <td>
                  {a.trang_thai === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm" onClick={() => updateStatus(a.id, 'confirmed')} style={{ marginRight: 4 }}><Check size={14} /> Xac nhan</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.id, 'cancelled')} style={{ marginRight: 4 }}><X size={14} /> Huy</button>
                    </>
                  )}
                  {['pending', 'confirmed'].includes(a.trang_thai) && (
                    <button className="btn btn-primary btn-sm" onClick={() => openWorkPanel(a)}>Lam viec / chot thue</button>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40 }}>Chua co lich hen nao</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="detail-grid" style={{ marginTop: 24 }}>
          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: 12 }}>Ghi nhan lich su lam viec</h3>
            <p style={{ marginBottom: 12 }}>{selected.User?.full_name || 'Khach hang'} - {selected.Property?.dia_chi_chi_tiet}</p>
            <div className="form-group">
              <label>Noi dung trao doi</label>
              <textarea rows="4" value={interactionText} onChange={(e) => setInteractionText(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={saveInteraction}>Luu lich su</button>
          </div>

          <div className="form-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ marginBottom: 12 }}>Chot hop dong thue</h3>
            <div className="form-group">
              <label>Gia tri hop dong</label>
              <input type="number" value={contractForm.gia_tri_hop_dong} onChange={(e) => setContractForm({ ...contractForm, gia_tri_hop_dong: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phan tram hoa hong</label>
              <input type="number" value={contractForm.phan_tram_hoa_hong} onChange={(e) => setContractForm({ ...contractForm, phan_tram_hoa_hong: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Ngay bat dau</label>
              <input type="date" value={contractForm.ngay_bat_dau} onChange={(e) => setContractForm({ ...contractForm, ngay_bat_dau: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Ngay ket thuc</label>
              <input type="date" value={contractForm.ngay_ket_thuc} onChange={(e) => setContractForm({ ...contractForm, ngay_ket_thuc: e.target.value })} />
            </div>
            <button className="btn btn-success" onClick={closeRentalContract}>Tao hop dong va tinh hoa hong</button>
            <button className="btn" style={{ marginLeft: 8, border: '1px solid #cbd5e0' }} onClick={() => setSelected(null)}>Dong</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAppointments;
