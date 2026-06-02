import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { cancelDepositContract, downloadContractDocument, uploadContractDocument } from '../api';

const ContractDetail = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  const fetchContract = () => {
    api.get(`/contracts/deposit/${id}`).then((r) => setContract(r.data?.data)).catch(() => {});
  };

  useEffect(() => { fetchContract(); }, [id]);

  const handleCancel = async () => {
    try {
      await cancelDepositContract(id, { ghi_chu: 'Chu nha yeu cau cham dut hop dong' });
      fetchContract();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the huy hop dong');
    }
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadContractDocument('deposit', id, {
        ten_file: file.name,
        mime_type: file.type || 'application/octet-stream',
        kich_thuoc: file.size,
        noi_dung_base64: await fileToBase64(file)
      });
      event.target.value = '';
      fetchContract();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the tai hop dong len');
    }
  };

  const handleDownload = async (documentId) => {
    try {
      const res = await downloadContractDocument(documentId);
      const doc = res.data.data;
      const link = document.createElement('a');
      link.href = `data:${doc.mime_type};base64,${doc.noi_dung_base64}`;
      link.download = doc.ten_file;
      link.click();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the tai file');
    }
  };

  if (!contract) return <div style={{ padding: 40 }}>Dang tai...</div>;

  return (
    <div>
      <div className="topbar">
        <h1>Chi tiet hop dong ky gui</h1>
        <button className="btn" onClick={() => navigate(-1)}>Quay lai</button>
      </div>
      <div className="form-card" style={{ maxWidth: '900px' }}>
        <div className="stats">
          <div className="stat-card"><div className="label">Ma hop dong</div><div className="value" style={{ fontSize: 16 }}>{contract.id}</div></div>
          <div className="stat-card"><div className="label">Trang thai</div><div className="value" style={{ fontSize: 18 }}>{contract.trang_thai}</div></div>
        </div>

        <h3 style={{ margin: '20px 0 12px' }}>Thong tin nha</h3>
        <p><strong>Loai nha:</strong> {contract.Property?.loai_nha}</p>
        <p><strong>Dien tich:</strong> {contract.Property?.dien_tich}m2</p>
        <p><strong>Dia chi:</strong> {contract.Property?.dia_chi_chi_tiet}</p>
        <p><strong>Gia de xuat:</strong> {Number(contract.Property?.gia_de_xuat || 0).toLocaleString('vi-VN')}d</p>

        <h3 style={{ margin: '20px 0 12px' }}>Ky gui va tien dam bao</h3>
        <p><strong>Tien dam bao:</strong> {Number(contract.tien_dam_bao || 0).toLocaleString('vi-VN')}d</p>
        <p><strong>Thoi han:</strong> {contract.thoi_han_thang} thang</p>
        <p><strong>Ngay het han:</strong> {contract.ngay_het_han || '---'}</p>
        <p><strong>Ghi chu:</strong> {contract.ghi_chu || '---'}</p>

        <h3 style={{ margin: '20px 0 12px' }}>Hoan tien</h3>
        {contract.Refunds?.length > 0 ? (
          <table>
            <thead><tr><th>Ngay yeu cau</th><th>So tien</th><th>Trang thai</th><th>Ghi chu</th></tr></thead>
            <tbody>
              {contract.Refunds.map((refund) => (
                <tr key={refund.id}>
                  <td>{refund.ngay_yeu_cau}</td>
                  <td>{Number(refund.so_tien_hoan || 0).toLocaleString('vi-VN')}d</td>
                  <td>{refund.trang_thai}</td>
                  <td>{refund.ghi_chu || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>Chua co phieu hoan tien.</p>}

        <h3 style={{ margin: '20px 0 12px' }}>File hop dong</h3>
        <div className="form-group">
          <label>Tai hop dong ky gui len</label>
          <input type="file" onChange={handleUpload} />
        </div>
        {contract.Documents?.length > 0 ? (
          <table>
            <thead><tr><th>Ten file</th><th>Kich thuoc</th><th>Ngay tai</th><th>Thao tac</th></tr></thead>
            <tbody>
              {contract.Documents.map((document) => (
                <tr key={document.id}>
                  <td>{document.ten_file}</td>
                  <td>{Number(document.kich_thuoc || 0).toLocaleString('vi-VN')} bytes</td>
                  <td>{document.created_at ? new Date(document.created_at).toLocaleString('vi-VN') : '---'}</td>
                  <td><button className="btn btn-sm" onClick={() => handleDownload(document.id)}>Tai xuong</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>Chua co file hop dong nao.</p>}

        {['active', 'terminated'].includes(contract.trang_thai) && (
          <button className="btn btn-danger" style={{ marginTop: 20 }} onClick={handleCancel}>
            Yeu cau huy / hoan tien
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;
