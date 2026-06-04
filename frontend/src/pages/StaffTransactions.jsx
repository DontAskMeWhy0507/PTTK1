import { useEffect, useMemo, useState } from 'react';
import { getTransactionLogs } from '../api';
import { History, RefreshCw } from 'lucide-react';

const typeLabel = {
  deposit_payment: 'Nộp tiền đảm bảo',
  rent_payment: 'Khách thanh toán tiền thuê',
  deposit_refund: 'Hoàn tiền đảm bảo',
  landlord_payout: 'Chuyển tiền cho chủ nhà',
  broker_payout: 'Chuyển hoa hồng cho môi giới'
};

const typeClass = {
  deposit_payment: 'badge-pending',
  rent_payment: 'badge-active',
  deposit_refund: 'badge-active',
  landlord_payout: 'badge-active',
  broker_payout: 'badge-active'
};

const transferTypes = ['deposit_payment', 'rent_payment', 'deposit_refund', 'landlord_payout', 'broker_payout'];
const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

const getTransferParties = (item) => {
  const user = item.User?.full_name || '---';
  const actor = item.Actor?.full_name || 'Hệ thống';
  if (item.loai_giao_dich === 'deposit_payment') return { from: actor, to: 'Đại lý' };
  if (item.loai_giao_dich === 'rent_payment') return { from: actor, to: 'Đại lý' };
  if (item.loai_giao_dich === 'deposit_refund') return { from: 'Đại lý', to: user };
  if (item.loai_giao_dich === 'landlord_payout') return { from: 'Đại lý', to: user };
  if (item.loai_giao_dich === 'broker_payout') return { from: 'Đại lý', to: user };
  return { from: actor, to: user };
};

const StaffTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactionLogs();
      setTransactions((res.data?.data || []).filter((item) => transferTypes.includes(item.loai_giao_dich)));
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const total = useMemo(
    () => transactions.reduce((sum, item) => sum + Number(item.so_tien || 0), 0),
    [transactions]
  );

  return (
    <div>
      <div className="topbar">
        <h1>Lịch sử giao dịch</h1>
        <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={loadTransactions} disabled={loading}>
          <RefreshCw size={16} /> {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="label">Tổng số giao dịch</span>
            <History size={20} color="#3182ce" />
          </div>
          <div className="value">{transactions.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Tổng giá trị ghi nhận</div>
          <div className="value" style={{ color: '#38a169' }}>{formatMoney(total)}đ</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Loại giao dịch</th>
              <th>Từ</th>
              <th>Đến</th>
              <th>Số tiền</th>
              <th>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => {
              const parties = getTransferParties(item);
              return (
                <tr key={item.id}>
                  <td>{item.thoi_gian ? new Date(item.thoi_gian).toLocaleString('vi-VN') : '---'}</td>
                  <td>
                    <span className={`badge ${typeClass[item.loai_giao_dich] || 'badge-pending'}`}>
                      {typeLabel[item.loai_giao_dich] || item.loai_giao_dich}
                    </span>
                  </td>
                  <td className="wrap">{parties.from}</td>
                  <td className="wrap">{parties.to}</td>
                  <td style={{ fontWeight: 800 }}>{formatMoney(item.so_tien)}đ</td>
                  <td className="wrap">{item.mo_ta}</td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 48, color: '#718096' }}>Chưa có lịch sử giao dịch nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffTransactions;
