import { useEffect, useState } from 'react';
import api from '../api';

const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

const StaffCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get('/employee/commissions').then((res) => {
      setCommissions(res.data?.data || []);
      setTotal(res.data?.total_earned || 0);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="topbar"><h1>Hoa hồng môi giới</h1></div>

      <div className="stats">
        <div className="stat-card">
          <div className="label">Tổng hoa hồng đã ghi nhận</div>
          <div className="value" style={{ color: '#38a169' }}>{formatMoney(total)}đ</div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Hợp đồng thuê</th>
              <th>Số tiền</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((item) => (
              <tr key={item.id}>
                <td>{item.hop_dong_thue_id || '---'}</td>
                <td>{formatMoney(item.so_tien)}đ</td>
                <td><span className="badge badge-active">Hoa hồng</span></td>
                <td>
                  <span className="badge badge-active">
                    {item.trang_thai === 'earned' ? 'Đã ghi nhận' : item.trang_thai}
                  </span>
                </td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '---'}</td>
              </tr>
            ))}
            {commissions.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40 }}>Chưa có hoa hồng nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffCommissions;
