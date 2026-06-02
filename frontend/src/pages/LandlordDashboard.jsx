import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { cancelDepositContract } from '../api';

const LandlordDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expiringSoon: 0, refundPending: 0 });
  const navigate = useNavigate();

  const fetchContracts = async () => {
    try {
      const res = await api.get('/contracts/deposit');
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
        refundPending: data.filter((c) => c.Refunds?.some((r) => r.trang_thai === 'pending')).length
      });
    } catch (err) {
      console.error('Loi tai hop dong:', err);
    }
  };

  useEffect(() => { fetchContracts(); }, []);

  const handleCancel = async (contractId) => {
    try {
      await cancelDepositContract(contractId, { ghi_chu: 'Chu nha yeu cau cham dut hop dong' });
      await fetchContracts();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the huy hop dong');
    }
  };

  const statusMap = {
    draft: 'Nhap',
    pending_deposit: 'Cho nop tien',
    active: 'Dang hieu luc',
    terminated: 'Tat toan',
    cancelled: 'Da huy'
  };

  const badgeMap = {
    draft: 'badge-pending',
    pending_deposit: 'badge-pending',
    active: 'badge-active',
    terminated: 'badge-expired',
    cancelled: 'badge-expired'
  };

  return (
    <div>
      <div className="topbar">
        <h1>Dashboard chu nha</h1>
        <button className="btn btn-primary" onClick={() => navigate('/deposit-request')}>+ Ky gui nha moi</button>
      </div>

      <div className="stats">
        <div className="stat-card"><div className="label">Tong nha ky gui</div><div className="value">{stats.total}</div></div>
        <div className="stat-card"><div className="label">Dang hieu luc</div><div className="value" style={{ color: '#38a169' }}>{stats.active}</div></div>
        <div className="stat-card"><div className="label">Sap het han 6 thang</div><div className="value" style={{ color: stats.expiringSoon > 0 ? '#e53e3e' : '#718096' }}>{stats.expiringSoon}</div></div>
        <div className="stat-card"><div className="label">Cho hoan tien</div><div className="value">{stats.refundPending}</div></div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Dia chi</th>
              <th>Loai nha</th>
              <th>Ngay ky</th>
              <th>Han 6 thang</th>
              <th>Trang thai</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>Chua co nha ky gui nao.</td></tr>}
            {contracts.map((c) => (
              <tr key={c.id}>
                <td>{c.Property?.dia_chi_chi_tiet || c.nha_cho_thue_id}</td>
                <td>{c.Property?.loai_nha || '---'}</td>
                <td>{c.ngay_ky || '---'}</td>
                <td>{c.ngay_het_han || '---'}</td>
                <td><span className={`badge ${badgeMap[c.trang_thai]}`}>{statusMap[c.trang_thai] || c.trang_thai}</span></td>
                <td>
                  <button className="btn btn-sm" style={{ marginRight: 6, border: '1px solid #cbd5e0', background: '#fff' }} onClick={() => navigate(`/contracts/deposit/${c.id}`)}>Chi tiet</button>
                  {c.trang_thai === 'pending_deposit' && (
                    <button className="btn btn-success btn-sm" style={{ marginRight: 6 }} onClick={() => api.post(`/properties/pay-deposit/${c.id}`).then(fetchContracts)}>
                      Nop 1.000.000d
                    </button>
                  )}
                  {['active', 'terminated'].includes(c.trang_thai) && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(c.id)}>Huy / hoan tien</button>
                  )}
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
