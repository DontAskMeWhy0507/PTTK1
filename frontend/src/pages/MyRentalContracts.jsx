import { useEffect, useState } from 'react';
import { downloadContractDocument, getMyRentalContracts, getRentalContractDetail, uploadContractDocument, payRent } from '../api';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Download, Upload, User, Home, Calendar, CreditCard, X } from 'lucide-react';

const MyRentalContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [documentsByContract, setDocumentsByContract] = useState({});
  const [paymentModal, setPaymentModal] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const { showNotification } = useUI();
  const { user } = useAuth();

  const loadContracts = () => {
    getMyRentalContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      const entries = await Promise.all(
        contracts.map(async (contract) => {
          try {
            const res = await getRentalContractDetail(contract.id);
            return [contract.id, res.data?.data?.Documents || []];
          } catch (error) {
            return [contract.id, []];
          }
        })
      );
      setDocumentsByContract(Object.fromEntries(entries));
    };

    if (contracts.length > 0) loadDocuments();
    else setDocumentsByContract({});
  }, [contracts]);

  useEffect(() => {
    let timer;
    if (paymentModal) {
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            executePayment(paymentModal.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentModal]);

  const executePayment = async (id) => {
    try {
      await payRent(id);
      showNotification('Thanh toan tien thue nha thanh cong!', 'success');
      setPaymentModal(null);
      loadContracts();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Loi thanh toan', 'error');
      setPaymentModal(null);
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleUpload = async (contractId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadContractDocument('rental', contractId, {
        ten_file: file.name,
        mime_type: file.type || 'application/octet-stream',
        kich_thuoc: file.size,
        noi_dung_base64: await fileToBase64(file)
      });
      event.target.value = '';
      showNotification('Da tai hop dong thue len', 'success');
      loadContracts();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the tai file len', 'error');
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

  const statusMap = {
    draft: { label: 'Nhap', color: '#718096' },
    pending_sign: { label: 'Cho ky', color: '#ecc94b' },
    pending_payment: { label: 'Cho thanh toan', color: '#dd6b20' },
    paid: { label: 'Da thanh toan', color: '#38a169' },
    active: { label: 'Dang hieu luc', color: '#3182ce' },
    completed: { label: 'Da ket thuc', color: '#a0aec0' }
  };

  return (
    <div>
      {paymentModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn" style={{ padding: 4 }} onClick={() => setPaymentModal(null)}>
                <X size={20} color="#718096" />
              </button>
            </div>
            <h3>Thanh toan tien thue nha</h3>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#2d3748', margin: '16px 0' }}>
              So tien: {Number(paymentModal.gia_tri_hop_dong || 0).toLocaleString('vi-VN')} VNĐ
            </p>
            <div style={{ background: '#f7fafc', padding: 24, borderRadius: 16, marginBottom: 24 }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=RENT_PAYMENT_${paymentModal.id}`} 
                alt="QR Code" 
                style={{ width: 180, height: 180, display: 'block', margin: '0 auto' }}
              />
            </div>
            <div style={{ padding: '16px', background: '#ebf8ff', borderRadius: '12px', color: '#2c5282' }}>
               He thong dang xac nhan sau {countdown} giay...
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <h1>Hop dong thue nha cua toi</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {contracts.map((contract) => (
          <div key={contract.id} className="stat-card" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 32 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <Home size={20} color="#3182ce" />
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{contract.Property?.loai_nha}</h3>
                </div>
                <p style={{ fontSize: '14px', color: '#718096', marginBottom: 12 }}>{contract.Property?.dia_chi_chi_tiet}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px' }}>
                  <User size={16} color="#718096" />
                  <span>Moi gioi: <strong>{contract.Broker?.full_name || '---'}</strong></span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', color: '#a0aec0', textTransform: 'uppercase', marginBottom: 12 }}>Thong tin thue</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: '15px' }}>Gia tri: <strong>{Number(contract.gia_tri_hop_dong || 0).toLocaleString('vi-VN')} VNĐ</strong></p>
                  <p style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} /> Tu: {contract.ngay_bat_dau}
                  </p>
                  <p style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} /> Den: {contract.ngay_ket_thuc}
                  </p>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', color: '#a0aec0', textTransform: 'uppercase', marginBottom: 12 }}>Tai lieu & Trang thai</h4>
                <span className="badge" style={{ background: statusMap[contract.trang_thai]?.color || '#edf2f7', color: '#fff', marginBottom: 16, display: 'inline-block' }}>
                  {statusMap[contract.trang_thai]?.label || contract.trang_thai}
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {contract.trang_thai === 'pending_payment' && (
                    <button className="btn btn-success btn-sm" onClick={() => setPaymentModal(contract)}>
                      <CreditCard size={14} /> Thanh toan thue
                    </button>
                  )}

                  {['broker', 'admin'].includes(user?.role) && (
                    <div style={{ position: 'relative' }}>
                      <input type="file" onChange={(e) => handleUpload(contract.id, e)} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', width: '120px' }} />
                      <button className="btn btn-sm" style={{ border: '1px solid #3182ce', color: '#3182ce', background: '#fff', width: '100%' }}>
                        <Upload size={14} /> Tai ban scan
                      </button>
                    </div>
                  )}
...

                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {(documentsByContract[contract.id] || []).map((doc) => (
                      <button key={doc.id} className="btn btn-sm" style={{ fontSize: '11px', justifyContent: 'space-between', padding: '4px 8px' }} onClick={() => handleDownload(doc.id)}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.ten_file}</span>
                        <Download size={12} style={{ flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {contracts.length === 0 && (
          <div style={{ padding: '80px 20px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e0' }}>
            <FileText size={64} color="#cbd5e0" style={{ marginBottom: 20 }} />
            <h3 style={{ color: '#4a5568' }}>Ban chua co hop dong thue nao</h3>
            <p style={{ marginTop: 12, color: '#718096' }}>Sau khi xem nha va chot thue, hop dong se xuat hien tai day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentalContracts;
