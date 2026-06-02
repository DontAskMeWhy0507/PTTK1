import { useEffect, useState } from 'react';
import { getInteractions } from '../api';

const StaffWorkHistory = () => {
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    getInteractions().then((res) => setInteractions(res.data?.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="topbar"><h1>Lich su lam viec</h1></div>
      <div className="table-container">
        <table>
          <thead><tr><th>Thoi gian</th><th>Khach hang</th><th>Nha</th><th>Loai</th><th>Noi dung</th></tr></thead>
          <tbody>
            {interactions.map((item) => (
              <tr key={item.id}>
                <td>{item.ngay_gio ? new Date(item.ngay_gio).toLocaleString('vi-VN') : '---'}</td>
                <td>{item.Customer?.full_name || item.khach_hang_id}</td>
                <td>{item.Property?.dia_chi_chi_tiet || '---'}</td>
                <td>{item.loai_trao_doi}</td>
                <td>{item.noi_dung_trao_doi}</td>
              </tr>
            ))}
            {interactions.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: 32 }}>Chua co lich su lam viec</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffWorkHistory;
