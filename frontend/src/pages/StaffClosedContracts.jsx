import { useEffect, useState } from 'react';
import { getClosedRentalContracts } from '../api';

const StaffClosedContracts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    getClosedRentalContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
  }, []);

  const statusMap = {
    pending_payment: { label: 'Chờ khách trả tiền', class: 'badge-pending' },
    paid: { label: 'Đã thanh toán', class: 'badge-active' },
    active: { label: 'Đang hiệu lực', class: 'badge-active' },
    completed: { label: 'Đã kết thúc', class: 'badge-rejected' }
  };

  return (
    <div>
      <div className="topbar"><h1>Danh sách Hợp đồng thuê nhà</h1></div>
      <div className="table-container">
        <table>
          <thead><tr><th>Khách hàng</th><th>Bất động sản</th><th>Giá trị HD</th><th>Hoa hồng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {contracts.map((contract) => {
              const status = statusMap[contract.trang_thai] || { label: contract.trang_thai, class: '' };
              const commissionTotal = (contract.Commissions || []).reduce((sum, row) => {
                const amount = Number(row.so_tien || 0);
                return row.loai === 'deduction' ? sum - amount : sum + amount;
              }, 0);
              return (
                <tr key={contract.id}>
                  <td>
                    <strong>{contract.Customer?.full_name}</strong>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{contract.Customer?.phone_number}</div>
                  </td>
                  <td className="wrap">{contract.Property?.dia_chi_chi_tiet}</td>
                  <td>{Number(contract.gia_tri_hop_dong || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{commissionTotal.toLocaleString('vi-VN')} VNĐ</td>
                  <td><span className={`badge ${status.class}`}>{status.label}</span></td>
                  <td>
                     <button className="btn btn-sm" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate(`/contracts/rental/${contract.id}`)}>Chi tiết</button>
                  </td>
                </tr>
              );
            })}
            {contracts.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32 }}>Chưa có hợp đồng nào được lập.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffClosedContracts;
