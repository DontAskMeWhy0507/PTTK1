import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { cancelDepositContract, downloadContractDocument, uploadContractDocument, staffSignContract, processRefund } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { FileText, Download, Upload, ArrowLeft, Home, Shield } from 'lucide-react';

const ContractDetail = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [activating, setActivating] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useUI();
  const navigate = useNavigate();

  const fetchContract = async () => {
    try {
      const res = await api.get(`/contracts/deposit/${id}`);
      setContract(res.data?.data);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the tai hop dong', 'error');
    }
  };

  useEffect(() => { fetchContract(); }, [id]);

  const handleCancel = async () => {
    try {
      await cancelDepositContract(id, { ghi_chu: 'Chu nha yeu cau cham dut hop dong' });
      showNotification('Da gui yeu cau huy hop dong', 'success');
      fetchContract();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the huy hop dong', 'error');
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadContractDocument('deposit', id, {
        ten_file: file.name,
        mime_type: file.type || 'application/octet-stream',
        kich_thuoc: file.size,
        noi_dung_base64: await fileToBase64(file)
      });
      event.target.value = '';
      showNotification('Da tai hop dong len thanh cong', 'success');
      fetchContract();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the tai hop dong len', 'error');
    }
  };

  const handleDownload = async (documentId) => {
    try {
      const res = await downloadContractDocument(documentId);
      const doc = res.data.data;
      const link = document.createElement('a');
      link.href = `data:${doc.mime_type};base64,${doc.noi_dung_base64}`;
      link.download = doc.ten_file;
      link.click();
    } catch (error) {
      showNotification('Khong the tai file', 'error');
    }
  };

  const handleActivate = async () => {
    try {
      setActivating(true);
      const res = await staffSignContract(contract.id);
      setContract((prev) => ({ ...prev, ...res.data.data }));
      showNotification('Da kich hoat hop dong thanh cong', 'success');
      await fetchContract();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Loi kich hoat hop dong', 'error');
    } finally {
      setActivating(false);
    }
  };

  const handleProcessRefund = async (refundId, status) => {
    try {
      await processRefund(refundId, { trang_thai: status });
      showNotification('Da cap nhat phieu hoan tien', 'success');
      fetchContract();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the xu ly hoan tien', 'error');
    }
  };

  if (!contract) return <div style={{ padding: 60, textAlign: 'center' }}>Dang tai thong tin hop dong...</div>;

  const canActivate = contract.trang_thai === 'paid' && ['staff', 'admin'].includes(user?.role);
  const statusMap = {
    draft: { label: 'Cho khao sat', className: 'badge-pending' },
    pending_deposit: { label: 'Cho chu nha nop tien', className: 'badge-pending' },
    paid: { label: 'Da nop tien - cho kich hoat', className: 'badge-active' },
    active: { label: 'Dang hieu luc', className: 'badge-active' },
    terminated: { label: 'Tat toan', className: 'badge-rejected' },
    cancelled: { label: 'Da huy', className: 'badge-rejected' }
  };
  const currentStatus = statusMap[contract.trang_thai] || { label: contract.trang_thai, className: 'badge-pending' };
  const legalStatusMap = {
    pending: 'Cho kiem tra',
    verified: 'Hop le',
    needs_update: 'Can bo sung',
    rejected: 'Khong hop le'
  };

  return (
    <div>
      <div className="topbar">
        <h1>Chi tiet hop dong ky gui</h1>
        <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lai
        </button>
      </div>

      <div className="contract-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="stat-card" style={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Trang thai hop dong</div>
              <span className={`badge ${currentStatus.className}`} style={{ fontSize: '13px', padding: '8px 16px' }}>{currentStatus.label}</span>
            </div>
            {canActivate && (
              <button className="btn btn-success" onClick={handleActivate} disabled={activating}>
                {activating ? 'Dang kich hoat...' : 'Kich hoat hop dong'}
              </button>
            )}
          </div>

          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Home size={22} color="#3182ce" />
              <h3 style={{ fontSize: '18px' }}>Thong tin bat dong san</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <p><strong>Loai nha:</strong><br/> {contract.Property?.loai_nha}</p>
              <p><strong>Dien tich:</strong><br/> {contract.Property?.dien_tich} m²</p>
              <p className="wrap"><strong>Dia chi:</strong><br/> {contract.Property?.dia_chi_chi_tiet}</p>
              <p><strong>Gia cho thue:</strong><br/> {Number(contract.Property?.gia_de_xuat || 0).toLocaleString('vi-VN')} VNĐ</p>
            </div>
          </div>

          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Shield size={22} color="#38a169" />
              <h3 style={{ fontSize: '18px' }}>Ky gui & Tien dam bao</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <p><strong>Tien dam bao:</strong><br/> {Number(contract.tien_dam_bao || 0).toLocaleString('vi-VN')} VNĐ</p>
              <p><strong>Thoi han:</strong><br/> {contract.thoi_han_thang} thang</p>
              <p><strong>Ngay ky:</strong><br/> {contract.ngay_ky || 'Chua ky'}</p>
              <p><strong>Ngay het han:</strong><br/> {contract.ngay_het_han || '---'}</p>
              <p><strong>Lich khao sat:</strong><br/> {contract.lich_khao_sat ? new Date(contract.lich_khao_sat).toLocaleString('vi-VN') : 'Chua hen'}</p>
              <p><strong>Phap ly:</strong><br/> {legalStatusMap[contract.trang_thai_phap_ly] || 'Cho kiem tra'}</p>
            </div>
            {contract.ghi_chu_phap_ly && (
              <div style={{ marginTop: 20, padding: 12, background: '#f7fafc', borderRadius: 8, fontSize: '14px' }}>
                <strong>Ghi chu phap ly:</strong> {contract.ghi_chu_phap_ly}
              </div>
            )}
            {contract.ghi_chu && (
              <div style={{ marginTop: 20, padding: 12, background: '#f7fafc', borderRadius: 8, fontSize: '14px' }}>
                <strong>Ghi chu:</strong> {contract.ghi_chu}
              </div>
            )}
          </div>

          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <FileText size={22} color="#805ad5" />
              <h3 style={{ fontSize: '18px' }}>Tai lieu hop dong</h3>
            </div>
            
            {['staff', 'admin'].includes(user?.role) && (
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label>Tai ban scan hop dong (PDF/Anh)</label>
                <div style={{ position: 'relative', marginTop: 8 }}>
                  <input type="file" onChange={handleUpload} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 2 }} />
                  <div style={{ padding: '12px', border: '2px dashed #cbd5e0', borderRadius: '12px', textAlign: 'center', color: '#718096', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <Upload size={18} /> Bam de chon file hoac keo tha
                  </div>
                </div>
              </div>
            )}

            {canActivate && (
              <div style={{ padding: 16, background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 14, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#166534', marginBottom: 4 }}>Hop dong da san sang kich hoat</div>
                  <div style={{ fontSize: 13, color: '#2f855a' }}>Sau khi tai file hop dong len, bam kich hoat de chuyen sang Dang hieu luc.</div>
                </div>
                <button className="btn btn-success" onClick={handleActivate} disabled={activating}>
                  {activating ? 'Dang kich hoat...' : 'Kich hoat hop dong'}
                </button>
              </div>
            )}

            <div className="table-container">
              <table>
                <thead><tr><th>Ten file</th><th>Ngay tai</th><th>Hanh dong</th></tr></thead>
                <tbody>
                  {contract.Documents?.map((doc) => (
                    <tr key={doc.id}>
                      <td className="wrap">{doc.ten_file}</td>
                      <td>{new Date(doc.created_at).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button className="btn btn-sm" style={{ border: '1px solid #e2e8f0' }} onClick={() => handleDownload(doc.id)}>
                          <Download size={14} /> Tai ve
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!contract.Documents || contract.Documents.length === 0) && (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: 20, color: '#a0aec0' }}>Chua co tai lieu nao duoc tai len.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '16px', marginBottom: 16 }}>Trang thai hien tai</h3>
            <span className={`badge ${currentStatus.className}`} style={{ fontSize: '14px', padding: '8px 16px' }}>{currentStatus.label}</span>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {canActivate && (
                <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={handleActivate} disabled={activating}>
                  {activating ? 'Dang kich hoat...' : 'Kich hoat hop dong'}
                </button>
              )}
              {['active', 'terminated'].includes(contract.trang_thai) && (
                <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCancel}>
                  Yeu cau huy / hoan tien
                </button>
              )}
            </div>
          </div>

          <div className="stat-card" style={{ maxWidth: '100%' }}>
            <h3 style={{ fontSize: '16px', marginBottom: 16 }}>Lich su hoan tien</h3>
            {contract.Refunds?.map((r) => (
              <div key={r.id} style={{ padding: '12px 0', borderBottom: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong>{Number(r.so_tien_hoan).toLocaleString('vi-VN')}d</strong>
                  <span className="badge badge-pending">{r.trang_thai}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#718096' }}>Ngay: {r.ngay_yeu_cau}</p>
                {['staff', 'admin'].includes(user?.role) && r.trang_thai === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <button className="btn btn-sm btn-primary" onClick={() => handleProcessRefund(r.id, 'approved')}>Duyet</button>
                    <button className="btn btn-sm btn-success" onClick={() => handleProcessRefund(r.id, 'paid')}>Da hoan tien</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleProcessRefund(r.id, 'rejected')}>Tu choi</button>
                  </div>
                )}
                {['staff', 'admin'].includes(user?.role) && r.trang_thai === 'approved' && (
                  <button className="btn btn-sm btn-success" style={{ marginTop: 10 }} onClick={() => handleProcessRefund(r.id, 'paid')}>Danh dau da hoan tien</button>
                )}
              </div>
            ))}
            {(!contract.Refunds || contract.Refunds.length === 0) && (
              <p style={{ color: '#a0aec0', fontSize: '14px' }}>Chua co yeu cau hoan tien.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
