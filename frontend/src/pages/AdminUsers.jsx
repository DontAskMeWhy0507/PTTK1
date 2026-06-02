import { useEffect, useState } from 'react';
import { getUsers, updateUserRole } from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    getUsers().then((res) => setUsers(res.data?.data || [])).catch(() => {});
  };

  useEffect(() => { loadUsers(); }, []);

  const updateUser = async (id, patch) => {
    try {
      await updateUserRole(id, patch);
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the cap nhat nguoi dung');
    }
  };

  return (
    <div>
      <div className="topbar"><h1>Quan tri phan quyen</h1></div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ho ten</th>
              <th>Email</th>
              <th>So dien thoai</th>
              <th>Vai tro</th>
              <th>Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number || '---'}</td>
                <td>
                  <select value={user.role} onChange={(e) => updateUser(user.id, { role: e.target.value })}>
                    <option value="customer">Khach hang</option>
                    <option value="employee">Nhan vien</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <select value={user.status} onChange={(e) => updateUser(user.id, { status: e.target.value })}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                    <option value="suspended">suspended</option>
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: 32 }}>Chua co nguoi dung</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
