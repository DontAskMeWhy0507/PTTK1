import { useEffect, useState } from 'react';
import { getUsers, adminUpdateUser, register } from '../api';
import { UserPlus, Edit2, Check, X, ShieldAlert } from 'lucide-react';

import { useUI } from '../contexts/UIContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const emptyUser = { full_name: '', email: '', password: '', phone_number: '', role: 'customer', bank_name: '', bank_account_number: '', bank_account_holder: '' };
  const [newUser, setNewUser] = useState(emptyUser);
  const [showAdd, setShowAdd] = useState(false);
  const { showNotification } = useUI();

  const loadUsers = () => {
    getUsers().then((res) => setUsers(res.data?.data || [])).catch(() => {});
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await register(newUser);
      setNewUser(emptyUser);
      setShowAdd(false);
      loadUsers();
      showNotification('Da tao tai khoan moi thanh cong', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the tao tai khoan', 'error');
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({ ...user, password: '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    try {
      await adminUpdateUser(editingId, editForm);
      setEditingId(null);
      loadUsers();
      showNotification('Da cap nhat thong tin tai khoan', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Khong the cap nhat', 'error');
    }
  };

  const getRoleBadge = (role) => {
    const maps = {
      admin: { label: 'Admin', color: '#805ad5' },
      staff: { label: 'Van phong', color: '#3182ce' },
      broker: { label: 'Moi gioi', color: '#38a169' },
      landlord: { label: 'Chu nha', color: '#dd6b20' },
      customer: { label: 'Khach hang', color: '#718096' }
    };
    const roleInfo = maps[role] || { label: role, color: '#a0aec0' };
    return <span className="badge" style={{ background: roleInfo.color, color: '#fff' }}>{roleInfo.label}</span>;
  };

  return (
    <div>
      <div className="topbar">
        <h1>Quan ly tai khoan nguoi dung</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <UserPlus size={18} />
          {showAdd ? 'Dong form' : 'Them moi'}
        </button>
      </div>

      {showAdd && (
        <div className="form-card" style={{ marginBottom: 48, maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 2 }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>Tao tai khoan nguoi dung moi</h3>
          </div>
          
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>Ho ten *</label>
                <input value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} required placeholder="VD: Nguyen Van A" />
              </div>
              <div className="form-group">
                <label>Email lien he *</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required placeholder="email@congty.com" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mat khau truy cap *</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required placeholder="Toi thieu 6 ky tu" />
              </div>
              <div className="form-group">
                <label>So dien thoai</label>
                <input value={newUser.phone_number} onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })} placeholder="09xx xxx xxx" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Vai tro he thong</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="customer">Khach thue</option>
                  <option value="landlord">Chu nha</option>
                  <option value="staff">Nhan vien van phong</option>
                  <option value="broker">Nhan vien moi gioi</option>
                  <option value="admin">Quan tri vien</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngan hang</label>
                <input value={newUser.bank_name} onChange={(e) => setNewUser({ ...newUser, bank_name: e.target.value })} placeholder="Bat buoc voi chu nha/moi gioi" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>So tai khoan</label>
                <input value={newUser.bank_account_number} onChange={(e) => setNewUser({ ...newUser, bank_account_number: e.target.value })} placeholder="So tai khoan ngan hang" />
              </div>
              <div className="form-group">
                <label>Chu tai khoan</label>
                <input value={newUser.bank_account_holder} onChange={(e) => setNewUser({ ...newUser, bank_account_holder: e.target.value })} placeholder="Ten chu tai khoan" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '52px', width: '100%' }}>
              Xac nhan tao tai khoan
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Thong tin ca nhan</th>
              <th style={{ width: '20%' }}>Tai khoan & Bao mat</th>
              <th style={{ width: '20%' }}>Tai khoan ngan hang</th>
              <th style={{ width: '12%' }}>Vai tro</th>
              <th style={{ width: '12%' }}>Trang thai</th>
              <th style={{ width: '16%' }}>Hanh dong</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="wrap">
                  {editingId === user.id ? (
                    <input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                  ) : (
                    <div style={{ fontWeight: 700 }}>{user.full_name}</div>
                  )}
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: 4 }}>
                    {editingId === user.id ? (
                      <input value={editForm.phone_number} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} placeholder="So dien thoai..." />
                    ) : (
                      user.phone_number || 'Chua cap nhat SĐT'
                    )}
                  </div>
                </td>
                <td className="wrap">
                  <div style={{ fontSize: '13px', color: '#4a5568' }}>
                    {editingId === user.id ? (
                      <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                    ) : (
                      user.email
                    )}
                  </div>
                  {editingId === user.id && (
                    <input type="password" placeholder="Doi mat khau..." value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} style={{ marginTop: 8 }} />
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input value={editForm.bank_name || ''} onChange={(e) => setEditForm({ ...editForm, bank_name: e.target.value })} placeholder="Ngan hang" />
                      <input value={editForm.bank_account_number || ''} onChange={(e) => setEditForm({ ...editForm, bank_account_number: e.target.value })} placeholder="So tai khoan" />
                      <input value={editForm.bank_account_holder || ''} onChange={(e) => setEditForm({ ...editForm, bank_account_holder: e.target.value })} placeholder="Chu tai khoan" />
                    </div>
                  ) : (
                    <div className="wrap">
                      <div style={{ fontWeight: 700 }}>{user.bank_name || 'Chua co ngan hang'}</div>
                      <div style={{ fontSize: 12, color: '#718096' }}>{user.bank_account_number || 'Chua co STK'}</div>
                      <div style={{ fontSize: 12, color: '#718096' }}>{user.bank_account_holder || ''}</div>
                      <div style={{ fontSize: 12, color: '#2f855a', fontWeight: 700, marginTop: 4 }}>
                        So du: {Number(user.account_balance || 0).toLocaleString('vi-VN')}d
                      </div>
                    </div>
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                      <option value="customer">Khach hang</option>
                      <option value="landlord">Chu nha</option>
                      <option value="staff">NV Van phong</option>
                      <option value="broker">Moi gioi</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    getRoleBadge(user.role)
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : (
                    <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-rejected'}`}>{user.status}</span>
                  )}
                </td>
                <td>
                  {editingId === user.id ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-success" onClick={handleUpdate}><Check size={16} /> Luu</button>
                      <button className="btn" onClick={cancelEdit}><X size={16} /> Huy</button>
                    </div>
                  ) : (
                    <button className="btn" style={{ border: '1px solid #e2e8f0' }} onClick={() => startEdit(user)}>
                      <Edit2 size={16} /> Chỉnh sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
