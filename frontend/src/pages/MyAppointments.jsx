import { useState, useEffect } from 'react';
import api, { updateMyAppointment } from '../api';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState('');

  const loadAppointments = () => {
    api.get('/appointments/my').then((res) => setAppointments(res.data.data));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    try {
      await updateMyAppointment(id, { trang_thai: 'cancelled' });
      loadAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the huy lich');
    }
  };

  const rescheduleAppointment = async (id) => {
    try {
      await updateMyAppointment(id, { ngay_gio: newDate, trang_thai: 'pending' });
      setEditingId(null);
      setNewDate('');
      loadAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Khong the doi lich');
    }
  };

  return (
    <div>
      <div className="topbar"><h1>Lich hen cua toi</h1></div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nha</th>
              <th>Ngay gio</th>
              <th>Trang thai</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.Property?.dia_chi_chi_tiet}</td>
                <td>
                  {editingId === a.id
                    ? <input type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    : new Date(a.ngay_gio).toLocaleString()}
                </td>
                <td><span className="badge badge-pending">{a.trang_thai}</span></td>
                <td>
                  {['pending', 'confirmed'].includes(a.trang_thai) && editingId !== a.id && (
                    <>
                      <button
                        className="btn btn-sm"
                        style={{ marginRight: 8, border: '1px solid #cbd5e0', background: '#fff' }}
                        onClick={() => {
                          setEditingId(a.id);
                          setNewDate(new Date(a.ngay_gio).toISOString().slice(0, 16));
                        }}
                      >
                        Doi lich
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(a.id)}>
                        Huy
                      </button>
                    </>
                  )}
                  {editingId === a.id && (
                    <>
                      <button className="btn btn-primary btn-sm" style={{ marginRight: 8 }} onClick={() => rescheduleAppointment(a.id)}>
                        Luu
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ border: '1px solid #cbd5e0', background: '#fff' }}
                        onClick={() => {
                          setEditingId(null);
                          setNewDate('');
                        }}
                      >
                        Bo qua
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {appointments.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>Chua co lich hen nao</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointments;
