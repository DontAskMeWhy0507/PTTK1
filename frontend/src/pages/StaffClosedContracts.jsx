import { useEffect, useState } from 'react';
import { getClosedRentalContracts } from '../api';

const StaffClosedContracts = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    getClosedRentalContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="topbar"><h1>Hop dong da chot</h1></div>
      <div className="table-container">
        <table>
          <thead><tr><th>Khach hang</th><th>Nha</th><th>Gia tri</th><th>Hoa hong</th><th>File</th><th>Trang thai</th></tr></thead>
          <tbody>
            {contracts.map((contract) => {
              const commissionTotal = (contract.Commissions || []).reduce((sum, row) => {
                const amount = Number(row.so_tien || 0);
                return row.loai === 'deduction' ? sum - amount : sum + amount;
              }, 0);
              return (
                <tr key={contract.id}>
                  <td>{contract.Customer?.full_name || contract.khach_hang_id}</td>
                  <td>{contract.Property?.dia_chi_chi_tiet || contract.nha_cho_thue_id}</td>
                  <td>{Number(contract.gia_tri_hop_dong || 0).toLocaleString('vi-VN')}d</td>
                  <td>{commissionTotal.toLocaleString('vi-VN')}d</td>
                  <td>{(contract.ContractDocuments || []).map((doc) => doc.ten_file).join(', ') || '---'}</td>
                  <td><span className="badge badge-active">{contract.trang_thai}</span></td>
                </tr>
              );
            })}
            {contracts.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 32 }}>Chua co hop dong da chot</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffClosedContracts;
