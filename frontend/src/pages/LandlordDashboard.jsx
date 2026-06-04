import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { cancelDepositContract, customerPayDeposit } from '../api';

import { useUI } from '../contexts/UIContext';
import { LayoutDashboard, PlusCircle, Home, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const getReceivedAmount = (contract) => {
  const rentals = contract.Property?.RentalContracts || [];
  return rentals.reduce((sum, rental) => {
    if (!['active', 'completed', 'paid'].includes(rental.trang_thai)) return sum;
    const contractValue = Math.round(Number(rental.gia_tri_hop_dong || 0));
    const commission = Math.round(Number(rental.tien_hoa_hong || 0));
    const depositDeduction = Math.min(Math.round(Number(contract.tien_dam_bao || 0)), commission);
    return sum + Math.max(contractValue - (commission - depositDeduction), 0);
  }, 0);
};

const LandlordDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expiringSoon: 0, refundPending: 0 });
  const [paymentModal, setPaymentModal] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const payingRef = useRef(false);
  const { showNotification, showConfirm } = useUI();
  const navigate = useNavigate();

  const fetchContracts = async () => {
    try {
      const res = await api.get(`/contracts/deposit?_t=${new Date().getTime()}`);
      const data = res.data?.data || [];
      setContracts(data);
      const today = new Date();
      const expSoon = data.filter((c) => {
        if (!c.ngay_het_han) return false;
        const diff = new Date(c.ngay_het_han) - today;
        return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000;
      });
      setStats({
        total: data.length,
        active: data.filter((c) => c.trang_thai === 'active').length,
        expiringSoon: expSoon.length,
        refundPending: data.filter((c) => c.Refunds?.some((r) => r.trang_thai === 'pending')).length,
        received: data.reduce((sum, contract) => sum + getReceivedAmount(contract), 0)
      });
    } catch (err) {
      console.error('Loi tai hop dong:', err);
    }
  };

  useEffect(() => { fetchContracts(); }, []);

  useEffect(() => {
    let timer;
    if (paymentModal) {
      payingRef.current = false;
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            executePayment(paymentModal);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentModal]);

  const handleCancel = (contractId) => {
    const contract = contracts.find((item) => item.id === contractId);
    const expired = contract?.ngay_het_han && new Date(contract.ngay_het_han) <= new Date();
    showConfirm(
      expired ? 'Huy hop dong / Hoan tien' : 'Huy hop dong truoc han',
      expired
        ? 'Ban co chac chan muon huy hop dong ky gui nay? Neu nha chua co hop dong thue, he thong se tao phieu hoan tien 1.000.000 VND.'
        : 'Ban co chac chan muon huy hop dong ky gui nay? Hop dong chua du 6 thang nen se khong hoan lai 1.000.000 VND tien dam bao.',
      async () => {
        try {
          await cancelDepositContract(contractId, { ghi_chu: 'Chu nha yeu cau cham dut hop dong' });
          showNotification('Da gui yeu cau huy hop dong thanh cong', 'success');
          fetchContracts();
        } catch (error) {
          showNotification(error.response?.data?.message || 'Khong the gui yeu cau', 'error');
        }
      }
    );
  };

  const executePayment = async (id) => {
    if (payingRef.current) return;
    payingRef.current = true;
    try {
      await customerPayDeposit(id);
      showNotification('Thanh toan tien dam bao thanh cong!', 'success');
      setPaymentModal(null);
      fetchContracts();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Co loi xay ra khi xac nhan', 'error');
      setPaymentModal(null);
    } finally {
      payingRef.current = false;
    }
  };

  const statusMap = {
    draft: { label: 'Cho danh gia', class: 'badge-pending' },
    pending_deposit: { label: 'Cho nop tien', class: 'badge-pending' },
    paid: { label: 'Da nop - Cho ky', class: 'badge-active' },
    active: { label: 'Dang hieu luc', class: 'badge-active' },
    terminated: { label: 'Tat toan', class: 'badge-rejected' },
    cancelled: { label: 'Da huy', class: 'badge-rejected' }
  };
  const legalStatusMap = {
    pending: 'Cho kiem tra',
    verified: 'Hop le',
    needs_update: 'Can bo sung',
    rejected: 'Khong hop le'
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
            <h3 style={{ marginBottom: 8 }}>Thanh toan 1.000.000 VNĐ</h3>
            <p style={{ color: '#718096', marginBottom: 24, fontSize: '14px' }}>Quet ma QR duoi day bang ung dung Ngan hang</p>
            
            <div style={{ background: '#f7fafc', padding: 24, borderRadius: 16, display: 'inline-block', marginBottom: 24 }}>
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PTTK_RENTAL_1_MILLION_VND" 
                alt="QR Code" 
                style={{ width: 200, height: 200, display: 'block', borderRadius: 8 }}
                onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23718096">Ma QR o day</text></svg>'; }}
              />
            </div>

            <div style={{ padding: 16, background: '#ebf8ff', borderRadius: 12, color: '#2c5282', fontWeight: 600 }}>
              He thong dang cho xac nhan sau {countdown} giay...
            </div>
          </div>
        </div>
      )}

      <div className="topbar">
        <h1>Dashboard Chu nha</h1>
        <button className="btn btn-primary" onClick={() => navigate('/deposit-request')}>
          <PlusCircle size={18} /> Ky gui nha moi
        </button>
      </div>

      <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Tong nha ky gui</span><Home size={20} color="#3182ce" /></div>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Dang hieu luc</span><CheckCircle size={20} color="#38a169" /></div>
          <div className="value" style={{ color: '#38a169' }}>{stats.active}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Sap het han 6t</span><Clock size={20} color="#dd6b20" /></div>
          <div className="value" style={{ color: stats.expiringSoon > 0 ? '#dd6b20' : '#718096' }}>{stats.expiringSoon}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Yeu cau hoan tien</span><AlertTriangle size={20} color="#e53e3e" /></div>
          <div className="value">{stats.refundPending}</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Tien da nhan</span><LayoutDashboard size={20} color="#2c5282" /></div>
          <div className="value" style={{ color: '#2c5282' }}>{formatMoney(stats.received)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 4, height: 24, background: '#3182ce', borderRadius: 2 }}></div>
        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Danh sach nha ky gui</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Bat dong san</th>
              <th>Tien da nhan</th>
              <th>Ngay ky</th>
              <th>Han 6 thang</th>
              <th>Trang thai</th>
              <th>Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 60, color: '#718096' }}>Ban chua co bat dong san nao ky gui.</td></tr>
            )}
            {contracts.map((c) => (
              <tr key={c.id}>
                <td className="wrap">
                  <div style={{ fontWeight: 700 }}>{c.Property?.loai_nha}</div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>{c.Property?.dia_chi_chi_tiet || 'Dang cap nhat...'}</div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: 4 }}>
                    Khao sat: {c.lich_khao_sat ? new Date(c.lich_khao_sat).toLocaleString('vi-VN') : 'Chua hen'} | Phap ly: {legalStatusMap[c.trang_thai_phap_ly] || 'Cho kiem tra'}
                  </div>
                </td>
                <td style={{ fontWeight: 800, color: getReceivedAmount(c) > 0 ? '#2c5282' : '#718096' }}>
                  {formatMoney(getReceivedAmount(c))}
                  <div style={{ fontSize: 12, color: '#718096', fontWeight: 500, marginTop: 4 }}>
                    Đảm bảo đã nộp: {formatMoney(c.tien_dam_bao)}
                  </div>
                </td>
                <td>{c.ngay_ky || '---'}</td>
                <td>{c.ngay_het_han || '---'}</td>
                <td>
                  <span className={`badge ${statusMap[c.trang_thai]?.class || 'badge-pending'}`}>
                    {statusMap[c.trang_thai]?.label || c.trang_thai}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate(`/contracts/deposit/${c.id}`)}>Chi tiet</button>
                    {c.trang_thai === 'pending_deposit' && (
                      <button className="btn btn-success btn-sm" onClick={() => setPaymentModal(c.id)}>Thanh toan 1T</button>
                    )}
                    {['active'].includes(c.trang_thai) && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(c.id)}>
                        {c.ngay_het_han && new Date(c.ngay_het_han) <= new Date() ? 'Huy / Hoan tien' : 'Huy khong hoan tien'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LandlordDashboard;
