import { useEffect, useMemo, useState } from 'react';
import { getTransactionLogs } from '../api';
import { History, RefreshCw } from 'lucide-react';

const typeLabel = {
  deposit_payment: 'Nop tien dam bao',
  rent_payment: 'Thanh toan thue',
  commission_pending: 'Hoa hong cho ghi nhan',
  commission_earned: 'Hoa hong da ghi nhan',
  deposit_deduction: 'Khau tru dam bao',
  deposit_refund: 'Hoan tien dam bao',
  rental_contract_created: 'Tao hop dong thue'
};

const typeClass = {
  deposit_payment: 'badge-pending',
  rent_payment: 'badge-active',
  commission_pending: 'badge-pending',
  commission_earned: 'badge-active',
  deposit_deduction: 'badge-rejected',
  deposit_refund: 'badge-active',
  rental_contract_created: 'badge-pending'
};

const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

const StaffTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactionLogs();
      setTransactions(res.data?.data || []);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const total = useMemo(() => transactions.reduce((sum, item) => sum + Number(item.so_tien || 0), 0), [transactions]);

  return (
    <div>
      <div className="topbar">
        <h1>Lich su giao dich</h1>
        <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={loadTransactions} disabled={loading}>
          <RefreshCw size={16} /> {loading ? 'Dang tai...' : 'Lam moi'}
        </button>
      </div>

      <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="label">Tong giao dich</span>
            <History size={20} color="#3182ce" />
          </div>
          <div className="value">{transactions.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Tong gia tri ghi nhan</div>
          <div className="value" style={{ color: '#38a169' }}>{formatMoney(total)}d</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Thoi gian</th>
              <th>Loai giao dich</th>
              <th>Nguoi lien quan</th>
              <th>Nguoi thuc hien</th>
              <th>So tien</th>
              <th>Noi dung</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.thoi_gian ? new Date(item.thoi_gian).toLocaleString('vi-VN') : '---'}</td>
                <td>
                  <span className={`badge ${typeClass[item.loai_giao_dich] || 'badge-pending'}`}>
                    {typeLabel[item.loai_giao_dich] || item.loai_giao_dich}
                  </span>
                </td>
                <td className="wrap">
                  <div style={{ fontWeight: 700 }}>{item.User?.full_name || '---'}</div>
                  <div style={{ fontSize: 12, color: '#718096' }}>{item.User?.email || ''}</div>
                </td>
                <td className="wrap">
                  <div style={{ fontWeight: 700 }}>{item.Actor?.full_name || 'He thong'}</div>
                  <div style={{ fontSize: 12, color: '#718096' }}>{item.Actor?.email || ''}</div>
                </td>
                <td style={{ fontWeight: 800 }}>{formatMoney(item.so_tien)}d</td>
                <td className="wrap">{item.mo_ta}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 48, color: '#718096' }}>Chua co lich su giao dich nao.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffTransactions;
