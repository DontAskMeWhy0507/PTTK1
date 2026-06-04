import { useEffect, useState } from 'react';
import { getMyContracts, updatePropertyReview, getAvailableForBrokers, claimProperty } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, Hand, Home, Clock, Edit2, X } from 'lucide-react';

import { useUI } from '../contexts/UIContext';

const StaffProperties = () => {
  const [contracts, setContracts] = useState([]);
  const [availableHouses, setAvailableHouses] = useState([]);
  const [evalModal, setEvalModal] = useState(null);
  const [hienTrang, setHienTrang] = useState('');
  const [surveyDate, setSurveyDate] = useState('');
  const [legalStatus, setLegalStatus] = useState('pending');
  const [legalNote, setLegalNote] = useState('');
  const { user } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();

  const loadData = () => {
    if (user?.role === 'staff' || user?.role === 'admin' || user?.role === 'broker') {
      getMyContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
    }
    if (user?.role === 'broker' || user?.role === 'admin') {
      getAvailableForBrokers().then((res) => setAvailableHouses(res.data?.data || [])).catch(() => {});
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleEvaluate = async () => {
    try {
      await updatePropertyReview(evalModal.nha_cho_thue_id, {
        hien_trang: hienTrang,
        trang_thai_hop_dong: 'pending_deposit',
        trang_thai_phap_ly: legalStatus,
        ghi_chu_phap_ly: legalNote
      });
      showNotification('Da cap nhat hien trang va yeu cau chu nha nop tien dam bao', 'success');
      setEvalModal(null);
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Co loi xay ra', 'error');
    }
  };

  const handleSendSurveyAppointment = async () => {
    if (!surveyDate) {
      showNotification('Vui long chon lich hen khao sat truoc khi gui', 'error');
      return;
    }

    try {
      await updatePropertyReview(evalModal.nha_cho_thue_id, {
        lich_khao_sat: surveyDate,
        message: 'Nhan vien van phong de xuat lich khao sat nha ky gui. Chu nha vui long xac nhan hoac de xuat lich khac.'
      });
      showNotification('Da gui lich hen khao sat cho chu nha', 'success');
      setEvalModal(null);
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the gui lich hen', 'error');
    }
  };

  const openEvalModal = (contract) => {
    setEvalModal(contract);
    setHienTrang(contract.Property?.hien_trang || '');
    setSurveyDate(contract.lich_khao_sat ? String(contract.lich_khao_sat).slice(0, 16) : '');
    setLegalStatus(contract.trang_thai_phap_ly || 'pending');
    setLegalNote(contract.ghi_chu_phap_ly || '');
  };

  const legalStatusLabel = {
    pending: 'Cho kiem tra',
    verified: 'Hop le',
    needs_update: 'Can bo sung',
    rejected: 'Khong hop le'
  };
  const appointmentStatusLabel = {
    pending: 'Chu nha de xuat lai',
    proposed: 'Cho chu nha xac nhan',
    confirmed: 'Da chot lich',
    rejected: 'Chu nha tu choi',
    completed: 'Da gap',
    cancelled: 'Da huy'
  };

  const handleClaim = async (id) => {
    try {
      await claimProperty(id);
      showNotification('Ban da nhan quan ly nha nay', 'success');
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Co loi xay ra', 'error');
    }
  };

  return (
    <div>
      {evalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '20px' }}>Danh gia & Thoa thuan hop tac</h3>
              <button className="btn" style={{ padding: 4 }} onClick={() => setEvalModal(null)}><X size={20} color="#718096" /></button>
            </div>
            <div className="form-group">
              <label>Ghi nhan hien trang / Ket qua danh gia</label>
              <textarea 
                rows="4" 
                value={hienTrang} 
                onChange={(e) => setHienTrang(e.target.value)} 
                placeholder="Da khao sat thuc te, chu nha dong y hop tac..." 
              />
            </div>
            <div className="form-group">
              <label>Lich hen khao sat voi chu nha</label>
              <input type="datetime-local" value={surveyDate} onChange={(e) => setSurveyDate(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', height: '44px', marginBottom: 16 }} onClick={handleSendSurveyAppointment}>
              Gui lich hen khao sat cho chu nha
            </button>
            <div className="form-group">
              <label>Trang thai phap ly</label>
              <select value={legalStatus} onChange={(e) => setLegalStatus(e.target.value)}>
                <option value="pending">Cho kiem tra</option>
                <option value="verified">Hop le</option>
                <option value="needs_update">Can bo sung</option>
                <option value="rejected">Khong hop le</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ghi chu phap ly</label>
              <textarea rows="3" value={legalNote} onChange={(e) => setLegalNote(e.target.value)} placeholder="So hong, uy quyen, CCCD chu nha..." />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', height: '48px', marginTop: 12 }} onClick={handleEvaluate}>
              Cap nhat hien trang & Yeu cau nop 1 trieu
            </button>
          </div>
        </div>
      )}

      <div className="topbar">
        <h1>{user?.role === 'broker' ? 'Kho nha cho thue' : 'Quan ly ky gui'}</h1>
      </div>

      {(user?.role === 'staff' || user?.role === 'admin') && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 2 }}></div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Yeu cau cho xu ly</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bat dong san</th>
                  <th>Gia cho thue</th>
                  <th>Trang thai</th>
                  <th>Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {contracts.filter(c => ['draft', 'pending_deposit'].includes(c.trang_thai)).map((contract) => (
                  <tr key={contract.id}>
                    <td className="wrap">
                      <div style={{ fontWeight: 700 }}>{contract.Property?.loai_nha}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{contract.Property?.dia_chi_chi_tiet}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                        Chu nha: {contract.Property?.Landlord?.full_name || '---'} | {contract.Property?.Landlord?.phone_number || 'Chua co SDT'} | {contract.Property?.Landlord?.email || ''}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                        Khao sat: {contract.lich_khao_sat ? new Date(contract.lich_khao_sat).toLocaleString('vi-VN') : 'Chua hen'} | Phap ly: {legalStatusLabel[contract.trang_thai_phap_ly] || 'Cho kiem tra'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                        Lich hen: {appointmentStatusLabel[contract.Property?.Appointments?.[0]?.trang_thai] || 'Chua gui'}
                      </div>
                    </td>
                    <td>{Number(contract.Property?.gia_de_xuat).toLocaleString('vi-VN')} VNĐ</td>
                    <td>
                      {contract.trang_thai === 'draft' && <span className="badge badge-pending">Cho khao sat</span>}
                      {contract.trang_thai === 'pending_deposit' && <span className="badge badge-pending" style={{ background: '#e2e8f0', color: '#4a5568' }}>Cho khach nop tien</span>}
                    </td>
                    <td>
                      {contract.trang_thai === 'draft' ? (
                        <button className="btn btn-primary btn-sm" onClick={() => openEvalModal(contract)}>
                          <Edit2 size={16} /> Cap nhat hien trang
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} /> Dang cho...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {contracts.filter(c => ['draft', 'pending_deposit'].includes(c.trang_thai)).length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Hien tai khong co yeu cau nao can xu ly.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(user?.role === 'staff' || user?.role === 'admin') && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 4, height: 24, background: '#38a169', borderRadius: 2 }}></div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Danh sach Hop dong ky gui</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Bat dong san</th>
                  <th>Chu nha</th>
                  <th>Ngay ky / Het han</th>
                  <th>Trang thai</th>
                  <th>Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {contracts.filter(c => ['paid', 'active', 'terminated', 'cancelled'].includes(c.trang_thai)).map((contract) => (
                  <tr key={contract.id}>
                    <td className="wrap">
                      <div style={{ fontWeight: 700 }}>{contract.Property?.loai_nha}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{contract.Property?.dia_chi_chi_tiet}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>
                        Khao sat: {contract.lich_khao_sat ? new Date(contract.lich_khao_sat).toLocaleString('vi-VN') : 'Chua hen'} | Phap ly: {legalStatusLabel[contract.trang_thai_phap_ly] || 'Cho kiem tra'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{contract.Property?.Landlord?.full_name || contract.Property?.chu_nha_id?.slice(0, 8)}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{contract.Property?.Landlord?.phone_number || '---'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{contract.Property?.Landlord?.email || ''}</div>
                    </td>
                    <td>
                      <div>Ky: {contract.ngay_ky || '---'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Han: {contract.ngay_het_han || '---'}</div>
                    </td>
                    <td>
                      {contract.trang_thai === 'paid' && <span className="badge badge-active">Da nop 1M - cho kich hoat</span>}
                      {contract.trang_thai === 'active' && <span className="badge badge-active">Dang hieu luc</span>}
                      {['terminated', 'cancelled'].includes(contract.trang_thai) && (
                        <span className="badge badge-rejected">{contract.trang_thai}</span>
                      )}
                    </td>
                    <td>
                      {contract.trang_thai === 'paid' ? (
                        <button className="btn btn-success btn-sm" onClick={() => navigate(`/contracts/deposit/${contract.id}`)}>
                          <Check size={16} /> Tai HD & Kich hoat
                        </button>
                      ) : (
                        <button className="btn btn-sm" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate(`/contracts/deposit/${contract.id}`)}>
                          Xem chi tiet
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {contracts.filter(c => ['paid', 'active', 'terminated', 'cancelled'].includes(c.trang_thai)).length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Chua co hop dong ky gui nao.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(user?.role === 'broker' || user?.role === 'admin') && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 24, background: '#3182ce', borderRadius: 2 }}></div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Bất động sản bạn đang quản lý</h2>
          </div>
          <div className="property-grid">
            {contracts.filter(c => c.Property?.broker_id === user?.id).map((c) => (
              <div key={c.id} className="property-card" style={{ border: '1px solid #bee3f8' }}>
                <div className="img" style={{ background: 'linear-gradient(135deg, #ebf8ff, #bee3f8)' }}><Home size={48} color="#3182ce" /></div>
                <div className="body">
                  <span className="badge badge-active" style={{ width: 'fit-content', marginBottom: 12 }}>Đang phụ trách</span>
                  <h3>{c.Property?.loai_nha}</h3>
                  <p className="address">{c.Property?.dia_chi_chi_tiet}</p>
                  <div className="price">{Number(c.Property?.gia_de_xuat).toLocaleString('vi-VN')} VNĐ</div>
                  <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => navigate(`/properties/${c.Property?.id}`)}>
                    Xem chi tiết & Khách hàng
                  </button>
                </div>
              </div>
            ))}
            {contracts.filter(c => c.Property?.broker_id === user?.id).length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, background: '#fff', borderRadius: 20, border: '1px dashed #cbd5e0' }}>
                <p style={{ color: 'var(--text-muted)' }}>Bạn chưa tiếp nhận quản lý căn nhà nào.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {(user?.role === 'broker' || user?.role === 'admin') && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 2 }}></div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Nha moi chua co nguoi quan ly</h2>
          </div>
          <div className="property-grid">
            {availableHouses.map((house) => (
              <div key={house.id} className="property-card">
                <div className="img"><Home size={48} /></div>
                <div className="body">
                  <span className="badge badge-active" style={{ width: 'fit-content', marginBottom: 12 }}>San sang</span>
                  <h3>{house.loai_nha}</h3>
                  <p className="address">{house.dia_chi_chi_tiet}</p>
                  <div className="price">{Number(house.gia_de_xuat).toLocaleString('vi-VN')} VNĐ/tháng</div>
                  <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => handleClaim(house.id)}>
                    <Hand size={18} /> Nhan cham soc khach hang
                  </button>
                </div>
              </div>
            ))}
            {availableHouses.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, background: '#fff', borderRadius: 20, border: '1px dashed #cbd5e0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Tat ca cac nha da co moi gioi quan ly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffProperties;
