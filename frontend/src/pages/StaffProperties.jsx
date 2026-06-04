import { useEffect, useMemo, useState } from 'react';
import {
  claimProperty,
  createRentalContract,
  getAvailableForBrokers,
  getMyContracts,
  logInteraction,
  updateAppointment,
  updatePropertyReview
} from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, Clock, Edit2, Hand, Home, X } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
const formatDateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : 'Chưa hẹn';

const contractStatusLabel = {
  draft: 'Chờ khảo sát',
  pending_deposit: 'Chờ chủ nhà nộp tiền đảm bảo',
  paid: 'Đã nộp tiền đảm bảo',
  active: 'Đang hiệu lực',
  terminated: 'Đã tất toán',
  cancelled: 'Đã hủy'
};

const legalStatusLabel = {
  pending: 'Chờ kiểm tra',
  verified: 'Hợp lệ',
  needs_update: 'Cần bổ sung',
  rejected: 'Không hợp lệ'
};

const appointmentStatusLabel = {
  pending: 'Đang chờ xác nhận',
  proposed: 'Đã đề xuất lịch',
  confirmed: 'Đã chốt lịch',
  rejected: 'Đã từ chối',
  completed: 'Đã hoàn tất',
  cancelled: 'Đã hủy',
  no_show: 'Không gặp được'
};

const appointmentTypeLabel = {
  deposit_survey: 'Khảo sát ký gửi',
  property_viewing: 'Xem nhà'
};

const rentalStatusLabel = {
  draft: 'Nháp',
  pending_sign: 'Chờ ký',
  pending_payment: 'Chờ khách thanh toán',
  paid: 'Đã thanh toán',
  active: 'Đang thuê',
  completed: 'Đã hoàn tất',
  cancelled: 'Đã hủy'
};

const StaffProperties = () => {
  const [contracts, setContracts] = useState([]);
  const [availableHouses, setAvailableHouses] = useState([]);
  const [evalModal, setEvalModal] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [hienTrang, setHienTrang] = useState('');
  const [surveyDate, setSurveyDate] = useState('');
  const [legalStatus, setLegalStatus] = useState('pending');
  const [legalNote, setLegalNote] = useState('');
  const [interactionText, setInteractionText] = useState('');
  const [surveyReschedule, setSurveyReschedule] = useState({});
  const [contractForm, setContractForm] = useState({
    gia_tri_hop_dong: '',
    phan_tram_hoa_hong: 5,
    ngay_bat_dau: '',
    ngay_ket_thuc: ''
  });
  const { user } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();

  const loadData = () => {
    if (['staff', 'admin', 'broker'].includes(user?.role)) {
      getMyContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
    }
    if (['broker', 'admin'].includes(user?.role)) {
      getAvailableForBrokers().then((res) => setAvailableHouses(res.data?.data || [])).catch(() => {});
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const pendingContracts = useMemo(
    () => contracts.filter((contract) => ['draft', 'pending_deposit'].includes(contract.trang_thai)),
    [contracts]
  );

  const signedContracts = useMemo(
    () => contracts.filter((contract) => ['paid', 'active', 'terminated', 'cancelled'].includes(contract.trang_thai)),
    [contracts]
  );

  const managedContracts = useMemo(
    () => contracts.filter((contract) => contract.Property?.broker_id === user?.id || user?.role === 'admin'),
    [contracts, user]
  );

  const refreshSelectedContract = (contractId) => {
    getMyContracts().then((res) => {
      const nextContracts = res.data?.data || [];
      setContracts(nextContracts);
      const nextSelected = nextContracts.find((item) => item.id === contractId);
      if (nextSelected) setSelectedContract(nextSelected);
    }).catch(() => {});
  };

  const openEvalModal = (contract) => {
    setEvalModal(contract);
    setHienTrang(contract.Property?.hien_trang || '');
    setSurveyDate(contract.lich_khao_sat ? String(contract.lich_khao_sat).slice(0, 16) : '');
    setLegalStatus(contract.trang_thai_phap_ly || 'pending');
    setLegalNote(contract.ghi_chu_phap_ly || '');
  };

  const openHouseDashboard = (contract) => {
    setSelectedContract(contract);
    setSelectedAppointment(null);
    setInteractionText('');
  };

  const startRentalFlow = (appointment) => {
    setSelectedAppointment(appointment);
    setInteractionText('');
    setContractForm({
      gia_tri_hop_dong: selectedContract?.Property?.gia_de_xuat ? Number(selectedContract.Property.gia_de_xuat) * 12 : '',
      phan_tram_hoa_hong: 5,
      ngay_bat_dau: '',
      ngay_ket_thuc: ''
    });
  };

  const handleSendSurveyAppointment = async () => {
    if (!surveyDate) {
      showNotification('Vui lòng chọn lịch hẹn khảo sát trước khi gửi.', 'error');
      return;
    }

    try {
      await updatePropertyReview(evalModal.nha_cho_thue_id, {
        lich_khao_sat: surveyDate,
        message: 'Nhân viên văn phòng đề xuất lịch khảo sát nhà ký gửi. Chủ nhà vui lòng xác nhận hoặc đề xuất lịch khác.'
      });
      showNotification('Đã gửi lịch hẹn khảo sát cho chủ nhà.', 'success');
      setEvalModal(null);
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Không thể gửi lịch hẹn.', 'error');
    }
  };

  const handleEvaluate = async () => {
    try {
      await updatePropertyReview(evalModal.nha_cho_thue_id, {
        hien_trang: hienTrang,
        trang_thai_hop_dong: 'pending_deposit',
        trang_thai_phap_ly: legalStatus,
        ghi_chu_phap_ly: legalNote
      });
      showNotification('Đã duyệt ký gửi và yêu cầu chủ nhà nộp tiền đảm bảo.', 'success');
      setEvalModal(null);
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Không thể cập nhật ký gửi.', 'error');
    }
  };

  const handleClaim = async (id) => {
    try {
      await claimProperty(id);
      showNotification('Bạn đã nhận quản lý nhà này.', 'success');
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Không thể nhận quản lý nhà.', 'error');
    }
  };

  const confirmViewingAppointment = async (appointment) => {
    try {
      await updateAppointment(appointment.id, {
        trang_thai: 'confirmed',
        message: 'Môi giới xác nhận lịch xem nhà.'
      });
      showNotification('Đã chốt lịch xem nhà.', 'success');
      refreshSelectedContract(selectedContract.id);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Không thể chốt lịch xem nhà.', 'error');
    }
  };

  const saveInteraction = async () => {
    if (!selectedAppointment || !interactionText.trim()) {
      showNotification('Vui lòng chọn lịch xem nhà và nhập nội dung làm việc.', 'error');
      return;
    }

    try {
      await logInteraction({
        khach_hang_id: selectedAppointment.khach_hang_id,
        nha_cho_thue_id: selectedAppointment.nha_cho_thue_id,
        ngay_gio: new Date().toISOString(),
        noi_dung_trao_doi: interactionText,
        loai_trao_doi: 'meeting'
      });
      setInteractionText('');
      showNotification('Đã lưu lịch sử làm việc.', 'success');
      refreshSelectedContract(selectedContract.id);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Không thể lưu lịch sử làm việc.', 'error');
    }
  };

  const closeRentalContract = async () => {
    if (!selectedAppointment) {
      showNotification('Vui lòng chọn lịch xem nhà đã chốt.', 'error');
      return;
    }

    try {
      await createRentalContract({
        appointment_id: selectedAppointment.id,
        khach_hang_id: selectedAppointment.khach_hang_id,
        nha_cho_thue_id: selectedAppointment.nha_cho_thue_id,
        ...contractForm
      });
      showNotification('Đã tạo hợp đồng thuê. Khách thuê cần thanh toán để hoàn tất.', 'success');
      setSelectedAppointment(null);
      refreshSelectedContract(selectedContract.id);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Không thể tạo hợp đồng thuê.', 'error');
    }
  };

  const renderAppointments = (appointments = []) => {
    if (appointments.length === 0) {
      return <p style={{ color: '#718096', padding: 16 }}>Chưa có lịch hẹn nào cho nhà này.</p>;
    }

    return (
      <div className="table-container" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
        <table>
          <thead>
            <tr>
              <th>Loại lịch</th>
              <th>Người liên quan</th>
              <th>Người phụ trách</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const canConfirm = appointment.loai_lich_hen === 'property_viewing' && ['pending', 'proposed', 'rejected'].includes(appointment.trang_thai);
              const canWork = appointment.loai_lich_hen === 'property_viewing' && ['confirmed', 'completed'].includes(appointment.trang_thai);
              const canHandleSurvey = appointment.loai_lich_hen === 'deposit_survey' && ['staff', 'admin'].includes(user?.role) && ['pending', 'proposed', 'rejected'].includes(appointment.trang_thai);
              return (
                <tr key={appointment.id}>
                  <td>{appointmentTypeLabel[appointment.loai_lich_hen] || appointment.loai_lich_hen}</td>
                  <td className="wrap">
                    <div style={{ fontWeight: 700 }}>{appointment.User?.full_name || '---'}</div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{appointment.User?.phone_number || appointment.User?.email || ''}</div>
                  </td>
                  <td className="wrap">
                    <div>{appointment.Broker?.full_name || 'Chưa phân công'}</div>
                    {appointment.Broker && (
                      <div style={{ fontSize: 12, color: '#718096' }}>
                        {appointment.Broker.phone_number || ''} {appointment.Broker.email ? `| ${appointment.Broker.email}` : ''}
                      </div>
                    )}
                  </td>
                  <td>{formatDateTime(appointment.ngay_gio)}</td>
                  <td><span className="badge badge-pending">{appointmentStatusLabel[appointment.trang_thai] || appointment.trang_thai}</span></td>
                  <td>
                    {canHandleSurvey && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleAction(appointment.id, { trang_thai: 'confirmed', message: 'Nhan vien van phong xac nhan lich khao sat.' })}>
                          <Check size={16} /> Chấp nhận
                        </button>
                        {surveyReschedule[appointment.id] ? (
                          <div style={{ display: 'flex', gap: 8, padding: 12, background: '#ebf8ff', borderRadius: 12 }}>
                            <input type="datetime-local" value={surveyReschedule[appointment.id]} onChange={(e) => setSurveyReschedule({ ...surveyReschedule, [appointment.id]: e.target.value })} style={{ flex: 1 }} />
                            <button className="btn btn-primary" onClick={() => handleAction(appointment.id, { ngay_gio: surveyReschedule[appointment.id], trang_thai: 'proposed', message: 'Nhan vien van phong de xuat lich khao sat moi.' })}>Lưu</button>
                            <button className="btn" onClick={() => setSurveyReschedule({ ...surveyReschedule, [appointment.id]: null })}>Hủy</button>
                          </div>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => setSurveyReschedule({ ...surveyReschedule, [appointment.id]: appointment.ngay_gio ? new Date(appointment.ngay_gio).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16) })}>
                            <Calendar size={16} /> Đổi lịch
                          </button>
                        )}
                      </div>
                    )}
                    {canConfirm && (
                      <button className="btn btn-success btn-sm" onClick={() => confirmViewingAppointment(appointment)}>
                        <Check size={16} /> Chốt lịch
                      </button>
                    )}
                    {canWork && (
                      <button className="btn btn-primary btn-sm" onClick={() => startRentalFlow(appointment)}>
                        Làm việc / Lập hợp đồng
                      </button>
                    )}
                    {!canConfirm && !canWork && <span style={{ color: '#718096' }}>Không cần thao tác</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderInteractions = (interactions = []) => (
    <div className="table-container" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
      <table>
        <thead>
          <tr>
            <th>Thời gian</th>
            <th>Khách hàng</th>
            <th>Môi giới</th>
            <th>Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map((interaction) => (
            <tr key={interaction.id}>
              <td>{formatDateTime(interaction.ngay_gio)}</td>
              <td>{interaction.Customer?.full_name || '---'}</td>
              <td>{interaction.Broker?.full_name || '---'}</td>
              <td className="wrap">{interaction.noi_dung_trao_doi}</td>
            </tr>
          ))}
          {interactions.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center', padding: 24 }}>Chưa có lịch sử làm việc.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderRentalContracts = (rentalContracts = []) => (
    <div className="table-container" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
      <table>
        <thead>
          <tr>
            <th>Khách thuê</th>
            <th>Giá trị</th>
            <th>Hoa hồng</th>
            <th>Trạng thái</th>
            <th>Thời hạn</th>
          </tr>
        </thead>
        <tbody>
          {rentalContracts.map((contract) => (
            <tr key={contract.id}>
              <td className="wrap">
                <div style={{ fontWeight: 700 }}>{contract.Customer?.full_name || '---'}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>{contract.Customer?.phone_number || contract.Customer?.email || ''}</div>
              </td>
              <td>{formatMoney(contract.gia_tri_hop_dong)}</td>
              <td>{formatMoney(contract.tien_hoa_hong)} ({Number(contract.phan_tram_hoa_hong || 0)}%)</td>
              <td>{rentalStatusLabel[contract.trang_thai] || contract.trang_thai}</td>
              <td>{contract.ngay_bat_dau || '---'} đến {contract.ngay_ket_thuc || '---'}</td>
            </tr>
          ))}
          {rentalContracts.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: 24 }}>Chưa có hợp đồng thuê.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {evalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20 }}>Đánh giá và thỏa thuận ký gửi</h3>
              <button className="btn" style={{ padding: 4 }} onClick={() => setEvalModal(null)}><X size={20} color="#718096" /></button>
            </div>

            <div className="form-group">
              <label>Ghi nhận hiện trạng / kết quả khảo sát</label>
              <textarea rows="4" value={hienTrang} onChange={(e) => setHienTrang(e.target.value)} placeholder="Đã khảo sát thực tế, nhà đạt yêu cầu..." />
            </div>
            <div className="form-group">
              <label>Lịch hẹn khảo sát với chủ nhà</label>
              <input type="datetime-local" value={surveyDate} onChange={(e) => setSurveyDate(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', height: 44, marginBottom: 16 }} onClick={handleSendSurveyAppointment}>
              Gửi lịch hẹn khảo sát cho chủ nhà
            </button>

            <div className="form-group">
              <label>Trạng thái pháp lý</label>
              <select value={legalStatus} onChange={(e) => setLegalStatus(e.target.value)}>
                <option value="pending">Chờ kiểm tra</option>
                <option value="verified">Hợp lệ</option>
                <option value="needs_update">Cần bổ sung</option>
                <option value="rejected">Không hợp lệ</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ghi chú pháp lý</label>
              <textarea rows="3" value={legalNote} onChange={(e) => setLegalNote(e.target.value)} placeholder="Sổ hồng, ủy quyền, CCCD chủ nhà..." />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', height: 48, marginTop: 12 }} onClick={handleEvaluate}>
              Duyệt thông tin và yêu cầu nộp 1.000.000đ
            </button>
          </div>
        </div>
      )}

      {selectedContract && (
        <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && setSelectedContract(null)}>
          <div className="modal-content" style={{ maxWidth: 1180 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2>{selectedContract.Property?.loai_nha}</h2>
                <p style={{ color: '#718096', marginTop: 4 }}>{selectedContract.Property?.dia_chi_chi_tiet}</p>
              </div>
              <button className="btn" onClick={() => setSelectedContract(null)}><X size={20} /></button>
            </div>

            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
              <div className="stat-card"><div className="label">Giá đề xuất</div><div className="value">{formatMoney(selectedContract.Property?.gia_de_xuat)}</div></div>
              <div className="stat-card"><div className="label">Ký gửi</div><div className="value" style={{ fontSize: 20 }}>{contractStatusLabel[selectedContract.trang_thai]}</div></div>
              <div className="stat-card"><div className="label">Pháp lý</div><div className="value" style={{ fontSize: 20 }}>{legalStatusLabel[selectedContract.trang_thai_phap_ly]}</div></div>
              <div className="stat-card"><div className="label">Chủ nhà</div><div className="value" style={{ fontSize: 18 }}>{selectedContract.Property?.Landlord?.full_name || '---'}</div></div>
            </div>

            <h3 style={{ marginBottom: 12 }}>Lịch hẹn liên quan</h3>
            {renderAppointments(selectedContract.Property?.Appointments || [])}

            {selectedAppointment && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                <div className="stat-card" style={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: 16, marginBottom: 16 }}>Ghi nhận làm việc với khách</h3>
                  <p style={{ color: '#4a5568', marginBottom: 12 }}>
                    Khách: <strong>{selectedAppointment.User?.full_name}</strong> - {selectedAppointment.User?.phone_number || selectedAppointment.User?.email || '---'}
                  </p>
                  <div className="form-group">
                    <textarea rows="6" value={interactionText} onChange={(e) => setInteractionText(e.target.value)} placeholder="Ghi chú kết quả dẫn khách xem nhà, nhu cầu, thỏa thuận thêm..." />
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveInteraction}>Lưu lịch sử làm việc</button>
                </div>

                <div className="stat-card" style={{ boxShadow: 'none', border: '1px solid #c6f6d5', background: '#f0fff4' }}>
                  <h3 style={{ fontSize: 16, marginBottom: 16 }}>Lập hợp đồng thuê</h3>
                  <div className="form-group">
                    <label>Tổng giá trị hợp đồng (VNĐ)</label>
                    <input type="number" value={contractForm.gia_tri_hop_dong} onChange={(e) => setContractForm({ ...contractForm, gia_tri_hop_dong: e.target.value })} placeholder="VD: 100000000" />
                  </div>
                  <div className="form-group">
                    <label>Tỉ lệ hoa hồng (%)</label>
                    <input type="number" value={contractForm.phan_tram_hoa_hong} onChange={(e) => setContractForm({ ...contractForm, phan_tram_hoa_hong: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group"><label>Từ ngày</label><input type="date" value={contractForm.ngay_bat_dau} onChange={(e) => setContractForm({ ...contractForm, ngay_bat_dau: e.target.value })} /></div>
                    <div className="form-group"><label>Đến ngày</label><input type="date" value={contractForm.ngay_ket_thuc} onChange={(e) => setContractForm({ ...contractForm, ngay_ket_thuc: e.target.value })} /></div>
                  </div>
                  <button className="btn btn-success" style={{ width: '100%', marginTop: 12, height: 48 }} onClick={closeRentalContract}>
                    Xác nhận chốt thuê nhà
                  </button>
                </div>
              </div>
            )}

            <h3 style={{ margin: '24px 0 12px' }}>Lịch sử làm việc</h3>
            {renderInteractions(selectedContract.Property?.Interactions || [])}

            <h3 style={{ margin: '24px 0 12px' }}>Hợp đồng thuê</h3>
            {renderRentalContracts(selectedContract.Property?.RentalContracts || [])}
          </div>
        </div>
      )}

      <div className="topbar">
        <h1>{user?.role === 'broker' ? 'Dashboard nhà và lịch hẹn' : 'Dashboard ký gửi'}</h1>
      </div>

      {['staff', 'admin'].includes(user?.role) && (
        <>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Yêu cầu ký gửi cần xử lý</h2>
          <div className="table-container" style={{ marginBottom: 40 }}>
            <table>
              <thead>
                <tr>
                  <th>Bất động sản</th>
                  <th>Chủ nhà</th>
                  <th>Khảo sát / pháp lý</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pendingContracts.map((contract) => {
                  const survey = (contract.Property?.Appointments || []).find((item) => item.loai_lich_hen === 'deposit_survey');
                  return (
                    <tr key={contract.id}>
                      <td className="wrap">
                        <div style={{ fontWeight: 700 }}>{contract.Property?.loai_nha}</div>
                        <div style={{ fontSize: 13, color: '#718096' }}>{contract.Property?.dia_chi_chi_tiet}</div>
                      </td>
                      <td>{contract.Property?.Landlord?.full_name || '---'}</td>
                      <td className="wrap">
                        <div>{contract.lich_khao_sat ? formatDateTime(contract.lich_khao_sat) : 'Chưa hẹn khảo sát'}</div>
                        <div style={{ fontSize: 12, color: '#718096' }}>
                          Pháp lý: {legalStatusLabel[contract.trang_thai_phap_ly] || 'Chờ kiểm tra'} | Lịch: {appointmentStatusLabel[survey?.trang_thai] || 'Chưa gửi'}
                        </div>
                      </td>
                      <td>{contractStatusLabel[contract.trang_thai] || contract.trang_thai}</td>
                      <td>
                        {contract.trang_thai === 'draft' ? (
                          <button className="btn btn-primary btn-sm" onClick={() => openEvalModal(contract)}>
                            <Edit2 size={16} /> Cập nhật khảo sát
                          </button>
                        ) : (
                          <span style={{ color: '#718096', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} /> Đang chờ chủ nhà nộp tiền
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {pendingContracts.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40 }}>Không có yêu cầu ký gửi cần xử lý.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Hợp đồng ký gửi</h2>
          <div className="table-container" style={{ marginBottom: 40 }}>
            <table>
              <thead>
                <tr>
                  <th>Bất động sản</th>
                  <th>Chủ nhà</th>
                  <th>Ngày ký / hết hạn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {signedContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="wrap">
                      <div style={{ fontWeight: 700 }}>{contract.Property?.loai_nha}</div>
                      <div style={{ fontSize: 13, color: '#718096' }}>{contract.Property?.dia_chi_chi_tiet}</div>
                    </td>
                    <td>{contract.Property?.Landlord?.full_name || '---'}</td>
                    <td>
                      <div>Ký: {contract.ngay_ky || '---'}</div>
                      <div style={{ fontSize: 12, color: '#718096' }}>Hết hạn: {contract.ngay_het_han || '---'}</div>
                    </td>
                    <td>{contractStatusLabel[contract.trang_thai] || contract.trang_thai}</td>
                    <td>
                      <button className="btn btn-sm" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate(`/contracts/deposit/${contract.id}`)}>
                        {contract.trang_thai === 'paid' ? <><Check size={16} /> Kích hoạt</> : 'Xem chi tiết'}
                      </button>
                    </td>
                  </tr>
                ))}
                {signedContracts.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40 }}>Chưa có hợp đồng ký gửi nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {['broker', 'admin'].includes(user?.role) && (
        <>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Nhà bạn đang phụ trách</h2>
          <div className="property-grid" style={{ marginBottom: 40 }}>
            {managedContracts.map((contract) => {
              const appointments = contract.Property?.Appointments || [];
              const activeAppointments = appointments.filter((item) => ['pending', 'proposed', 'confirmed'].includes(item.trang_thai));
              return (
                <button key={contract.id} className="property-card" style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid #bee3f8' }} onClick={() => openHouseDashboard(contract)}>
                  <div className="img" style={{ background: 'linear-gradient(135deg, #ebf8ff, #bee3f8)' }}><Home size={48} color="#3182ce" /></div>
                  <div className="body">
                    <span className="badge badge-active" style={{ width: 'fit-content', marginBottom: 12 }}>Đang phụ trách</span>
                    <h3>{contract.Property?.loai_nha}</h3>
                    <p className="address">{contract.Property?.dia_chi_chi_tiet}</p>
                    <div className="price">{formatMoney(contract.Property?.gia_de_xuat)}/tháng</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#4a5568', fontSize: 13 }}>
                      <Calendar size={16} /> {appointments.length} lịch hẹn, {activeAppointments.length} lịch đang mở
                    </div>
                  </div>
                </button>
              );
            })}
            {managedContracts.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, border: '1px dashed #cbd5e0' }}>
                Bạn chưa phụ trách nhà nào.
              </div>
            )}
          </div>

          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Nhà mới chưa có môi giới</h2>
          <div className="property-grid">
            {availableHouses.map((house) => (
              <div key={house.id} className="property-card">
                <div className="img"><Home size={48} /></div>
                <div className="body">
                  <span className="badge badge-active" style={{ width: 'fit-content', marginBottom: 12 }}>Sẵn sàng</span>
                  <h3>{house.loai_nha}</h3>
                  <p className="address">{house.dia_chi_chi_tiet}</p>
                  <div className="price">{formatMoney(house.gia_de_xuat)}/tháng</div>
                  <button className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }} onClick={() => handleClaim(house.id)}>
                    <Hand size={18} /> Nhận quản lý nhà
                  </button>
                </div>
              </div>
            ))}
            {availableHouses.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, border: '1px dashed #cbd5e0' }}>
                Tất cả nhà đang hiển thị đã có môi giới phụ trách.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StaffProperties;
