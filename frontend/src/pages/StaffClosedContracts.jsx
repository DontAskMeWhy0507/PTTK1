import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClosedRentalContracts } from '../api';

const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

const statusMap = {
  pending_payment: { label: 'Chờ khách thanh toán', className: 'badge-pending' },
  paid: { label: 'Đã thanh toán', className: 'badge-active' },
  active: { label: 'Đang hiệu lực', className: 'badge-active' },
  completed: { label: 'Đã kết thúc', className: 'badge-rejected' },
  cancelled: { label: 'Đã hủy', className: 'badge-rejected' }
};

const StaffClosedContracts = () => {
  const [contracts, setContracts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getClosedRentalContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="topbar"><h1>Danh sách hợp đồng thuê nhà</h1></div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Bất động sản</th>
              <th>Giá trị hợp đồng</th>
              <th>Hoa hồng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => {
              const status = statusMap[contract.trang_thai] || { label: contract.trang_thai, className: 'badge-pending' };
              const commissionTotal = (contract.Commissions || []).reduce((sum, row) => (
                row.loai === 'commission' ? sum + Number(row.so_tien || 0) : sum
              ), 0);

              return (
                <tr key={contract.id}>
                  <td>
                    <strong>{contract.Customer?.full_name || '---'}</strong>
                    <div style={{ fontSize: 12, color: '#718096' }}>{contract.Customer?.phone_number || ''}</div>
                  </td>
                  <td className="wrap">{contract.Property?.dia_chi_chi_tiet || '---'}</td>
                  <td>{formatMoney(contract.gia_tri_hop_dong)}đ</td>
                  <td>{formatMoney(commissionTotal)}đ</td>
                  <td><span className={`badge ${status.className}`}>{status.label}</span></td>
                  <td>
                    <button className="btn btn-sm" style={{ border: '1px solid #e2e8f0' }} onClick={() => navigate(`/contracts/rental/${contract.id}`)}>
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
            {contracts.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32 }}>Chưa có hợp đồng thuê nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffClosedContracts;
