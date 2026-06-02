import { useState, useEffect } from 'react';
import api from '../api';

const StaffCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get('/employee/commissions').then(r => {
      setCommissions(r.data?.data || []);
      setTotal(r.data?.total_earned || 0);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="topbar"><h1>Hoa hồng môi giới</h1></div>
      <div className="stats">
        <div className="stat-card">
          <div className="label">Tổng hoa hồng đã kiếm</div>
          <div className="value" style={{color:'#38a169'}}>{total.toLocaleString('vi-VN')}đ</div>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Hợp đồng</th><th>Số tiền</th><th>Loại</th><th>Trạng thái</th><th>Ngày</th></tr></thead>
          <tbody>
            {commissions.map(c => (
              <tr key={c.id}>
                <td>{c.hop_dong_thue_id || '---'}</td>
                <td>{(c.so_tien || 0).toLocaleString('vi-VN')}đ</td>
                <td><span className="badge badge-active">{c.loai === 'commission' ? 'Hoa hồng' : 'Khấu trừ'}</span></td>
                <td><span className="badge badge-pending">{c.trang_thai}</span></td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString('vi-VN') : '---'}</td>
              </tr>
            ))}
            {commissions.length === 0 && <tr><td colSpan="5" style={{textAlign:'center',padding:40}}>Chưa có hoa hồng nào</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StaffCommissions;
