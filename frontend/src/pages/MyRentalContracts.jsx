import { useEffect, useState } from 'react';
import { downloadContractDocument, getMyRentalContracts, getRentalContractDetail, uploadContractDocument } from '../api';

const MyRentalContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [documentsByContract, setDocumentsByContract] = useState({});

  const loadContracts = () => {
    getMyRentalContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const loadDocuments = async (contractId) => {
    const res = await getRentalContractDetail(contractId);
    setDocumentsByContract((prev) => ({ ...prev, [contractId]: res.data?.data?.Documents || [] }));
  };

  const handleUpload = async (contractId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadContractDocument('rental', contractId, {
        ten_file: file.name,
        mime_type: file.type || 'application/octet-stream',
        kich_thuoc: file.size,
        noi_dung_base64: await fileToBase64(file)
      });
      event.target.value = '';
      await loadDocuments(contractId);
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

  return (
    <div>
      <div className="topbar"><h1>Hop dong thue cua toi</h1></div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nha</th>
              <th>Nhan vien</th>
              <th>Gia tri</th>
              <th>Ngay ky</th>
              <th>Thoi han</th>
              <th>Trang thai</th>
              <th>File hop dong</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.Property?.dia_chi_chi_tiet || contract.nha_cho_thue_id}</td>
                <td>{contract.Broker?.full_name || '---'}</td>
                <td>{Number(contract.gia_tri_hop_dong || 0).toLocaleString('vi-VN')}d</td>
                <td>{contract.ngay_ky || '---'}</td>
                <td>{contract.ngay_bat_dau || '---'} - {contract.ngay_ket_thuc || '---'}</td>
                <td><span className="badge badge-active">{contract.trang_thai}</span></td>
                <td>
                  <input type="file" onChange={(event) => handleUpload(contract.id, event)} />
                  <button className="btn btn-sm" style={{ marginTop: 6 }} onClick={() => loadDocuments(contract.id)}>Xem file</button>
                  {(documentsByContract[contract.id] || []).map((document) => (
                    <div key={document.id} style={{ marginTop: 6 }}>
                      <button className="btn btn-sm" onClick={() => handleDownload(document.id)}>{document.ten_file}</button>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            {contracts.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32 }}>Chua co hop dong thue nao</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRentalContracts;
