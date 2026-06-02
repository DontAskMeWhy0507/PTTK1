import { useEffect, useState } from 'react';
import { createDepositRequest, getMyContracts, payDeposit, updatePropertyReview } from '../api';

const emptyForm = {
  chu_nha_id: '',
  loai_nha: '',
  dien_tich: '',
  huong_nha: '',
  so_luong_phong: 1,
  dia_chi_chi_tiet: '',
  gia_de_xuat: '',
  hien_trang: ''
};

const StaffProperties = () => {
  const [contracts, setContracts] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const loadContracts = () => {
    getMyContracts().then((res) => setContracts(res.data?.data || [])).catch(() => {});
  };

  useEffect(() => { loadContracts(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await createDepositRequest(form);
      setForm(emptyForm);
      loadContracts();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the tiep nhan nha');
    }
  };

  const review = async (contract, display) => {
    try {
      await updatePropertyReview(contract.nha_cho_thue_id, {
        hien_thi_chi_tiet: display,
        trang_thai_hop_dong: display ? 'active' : contract.trang_thai,
        ghi_chu: display ? 'Nhan vien da duyet hien thi nha' : contract.ghi_chu
      });
      loadContracts();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the cap nhat nha');
    }
  };

  return (
    <div>
      <div className="topbar"><h1>Quan ly nha ky gui</h1></div>
      <div className="detail-grid">
        <div className="form-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ marginBottom: 12 }}>Tiep nhan nha</h3>
          <form onSubmit={submit}>
            <div className="form-group"><label>Chu nha ID</label><input name="chu_nha_id" value={form.chu_nha_id} onChange={(e) => setForm({ ...form, chu_nha_id: e.target.value })} placeholder="Bo trong neu tao nhanh" /></div>
            <div className="form-group"><label>Loai nha</label><input name="loai_nha" value={form.loai_nha} onChange={(e) => setForm({ ...form, loai_nha: e.target.value })} required /></div>
            <div className="form-group"><label>Dien tich</label><input type="number" name="dien_tich" value={form.dien_tich} onChange={(e) => setForm({ ...form, dien_tich: e.target.value })} /></div>
            <div className="form-group"><label>Huong nha</label><input name="huong_nha" value={form.huong_nha} onChange={(e) => setForm({ ...form, huong_nha: e.target.value })} /></div>
            <div className="form-group"><label>So phong</label><input type="number" name="so_luong_phong" value={form.so_luong_phong} onChange={(e) => setForm({ ...form, so_luong_phong: e.target.value })} /></div>
            <div className="form-group"><label>Dia chi</label><input name="dia_chi_chi_tiet" value={form.dia_chi_chi_tiet} onChange={(e) => setForm({ ...form, dia_chi_chi_tiet: e.target.value })} required /></div>
            <div className="form-group"><label>Gia de xuat</label><input type="number" name="gia_de_xuat" value={form.gia_de_xuat} onChange={(e) => setForm({ ...form, gia_de_xuat: e.target.value })} /></div>
            <div className="form-group"><label>Hien trang / phap ly</label><textarea rows="3" name="hien_trang" value={form.hien_trang} onChange={(e) => setForm({ ...form, hien_trang: e.target.value })} /></div>
            <button className="btn btn-primary">Luu nha ky gui</button>
          </form>
        </div>

        <div className="table-container">
          <table>
            <thead><tr><th>Nha</th><th>Trang thai</th><th>Hien thi</th><th>Thao tac</th></tr></thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.Property?.dia_chi_chi_tiet || contract.nha_cho_thue_id}</td>
                  <td>{contract.trang_thai}</td>
                  <td>{contract.Property?.hien_thi_chi_tiet ? 'Dang hien thi' : 'An'}</td>
                  <td>
                    {contract.trang_thai === 'pending_deposit' && <button className="btn btn-success btn-sm" onClick={() => payDeposit(contract.id).then(loadContracts)}>Nop dam bao</button>}
                    <button className="btn btn-sm" style={{ marginLeft: 6 }} onClick={() => review(contract, true)}>Duyet hien thi</button>
                    <button className="btn btn-danger btn-sm" style={{ marginLeft: 6 }} onClick={() => review(contract, false)}>An nha</button>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 32 }}>Chua co nha ky gui</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffProperties;
