import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { FileText, Calendar, DollarSign, LogOut, Home, Key, UserPlus, Users, History } from 'lucide-react';

import Login from './pages/Login';
import Register from './pages/Register';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import MyAppointments from './pages/MyAppointments';
import MyRentalContracts from './pages/MyRentalContracts';
import StaffAppointments from './pages/StaffAppointments';
import StaffCommissions from './pages/StaffCommissions';
import StaffProperties from './pages/StaffProperties';
import StaffWorkHistory from './pages/StaffWorkHistory';
import StaffClosedContracts from './pages/StaffClosedContracts';
import AdminUsers from './pages/AdminUsers';
import ContractDetail from './pages/ContractDetail';

const roleLabel = {
  customer: 'Khach hang',
  employee: 'Nhan vien',
  admin: 'Admin'
};

const Sidebar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="sidebar">
      <div style={{ padding: '0 12px 24px', borderBottom: '1px solid #2d3748' }}>
        <h1 style={{ fontSize: '18px' }}>PTTK Rental</h1>
        {user && <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>{user.full_name} ({roleLabel[user.role] || user.role})</p>}
      </div>

      <h2>DIEU HUONG</h2>
      <Link to="/properties"><Home size={18} /> Xem nha</Link>

      {!user && (
        <>
          <Link to="/login"><UserPlus size={18} /> Dang nhap</Link>
          <Link to="/register"><UserPlus size={18} /> Dang ky khach hang</Link>
        </>
      )}

      {user?.role === 'customer' && (
        <>
          <h2>KHACH HANG</h2>
          <Link to="/appointments"><Calendar size={18} /> Lich hen cua toi</Link>
          <Link to="/rental-contracts"><FileText size={18} /> Hop dong thue</Link>
        </>
      )}

      {user?.role === 'employee' && (
        <>
          <h2>NHAN VIEN</h2>
          <Link to="/staff/properties"><Key size={18} /> Quan ly nha</Link>
          <Link to="/staff/appointments"><Calendar size={18} /> Lich xem nha</Link>
          <Link to="/staff/history"><History size={18} /> Lich su lam viec</Link>
          <Link to="/staff/contracts"><FileText size={18} /> Hop dong da chot</Link>
          <Link to="/staff/commissions"><DollarSign size={18} /> Hoa hong</Link>
        </>
      )}

      {user?.role === 'admin' && (
        <>
          <h2>ADMIN</h2>
          <Link to="/admin/users"><Users size={18} /> Phan quyen</Link>
        </>
      )}

      {user && (
        <div style={{ marginTop: 'auto' }}>
          <button onClick={logoutUser} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', color: '#fc8181' }}>
            <LogOut size={16} /> Dang xuat
          </button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Dang tai...</div>;

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/" element={<Navigate to="/properties" />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/rental-contracts" element={<MyRentalContracts />} />
          <Route path="/staff/properties" element={<StaffProperties />} />
          <Route path="/staff/appointments" element={<StaffAppointments />} />
          <Route path="/staff/history" element={<StaffWorkHistory />} />
          <Route path="/staff/contracts" element={<StaffClosedContracts />} />
          <Route path="/staff/commissions" element={<StaffCommissions />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/contracts/deposit/:id" element={<ContractDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
