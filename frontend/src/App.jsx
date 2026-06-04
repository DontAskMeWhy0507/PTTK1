import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { FileText, Calendar, DollarSign, LogOut, Home, Key, UserPlus, Users, History, LayoutDashboard, PlusCircle } from 'lucide-react';

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
import StaffTransactions from './pages/StaffTransactions';
import AdminUsers from './pages/AdminUsers';
import ContractDetail from './pages/ContractDetail';
import LandlordDashboard from './pages/LandlordDashboard';
import DepositRequest from './pages/DepositRequest';

const roleLabel = {
  customer: 'Thành viên',
  landlord: 'Chủ nhà',
  staff: 'NV Văn phòng',
  broker: 'NV Môi giới',
  admin: 'Admin'
};

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div style={{ padding: '0 12px 32px' }}>
        <h1>PTTK RENTAL</h1>
        {user && (
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{user.full_name}</p>
            <p style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>{roleLabel[user.role] || user.role}</p>
          </div>
        )}
      </div>

      <h2>ĐIỀU HƯỚNG</h2>
      {user?.role !== 'admin' && <Link to="/properties" className={isActive('/properties')}><Home size={18} /> Xem danh sách nhà</Link>}

      {!user && (
        <>
          <Link to="/login" className={isActive('/login')}><UserPlus size={18} /> Đăng nhập</Link>
          <Link to="/register" className={isActive('/register')}><UserPlus size={18} /> Đăng ký ngay</Link>
        </>
      )}

      {user?.role === 'landlord' && (
        <>
          <h2>CHỦ NHÀ</h2>
          <Link to="/landlord" className={isActive('/landlord')}><LayoutDashboard size={18} /> Dashboard của tôi</Link>
          <Link to="/deposit-request" className={isActive('/deposit-request')}><PlusCircle size={18} /> Ký gửi nhà cho thuê</Link>
          <Link to="/appointments" className={isActive('/appointments')}><Calendar size={18} /> Lịch hẹn khảo sát</Link>
        </>
      )}

      {user?.role === 'customer' && (
        <>
          <h2>KHÁCH THUÊ</h2>
          <Link to="/appointments" className={isActive('/appointments')}><Calendar size={18} /> Lịch hẹn xem nhà</Link>
          <Link to="/rental-contracts" className={isActive('/rental-contracts')}><FileText size={18} /> Hợp đồng thuê nhà</Link>
        </>
      )}

      {['staff', 'admin'].includes(user?.role) && (
        <>
          <h2>VĂN PHÒNG</h2>
          <Link to="/staff/properties" className={isActive('/staff/properties')}><Key size={18} /> Dashboard ký gửi</Link>
          {user?.role === 'staff' && <Link to="/staff/appointments" className={isActive('/staff/appointments')}><Calendar size={18} /> Lịch hẹn khảo sát</Link>}
          <Link to="/staff/contracts" className={isActive('/staff/contracts')}><FileText size={18} /> Quản lý hợp đồng</Link>
          <Link to="/staff/transactions" className={isActive('/staff/transactions')}><History size={18} /> Lịch sử giao dịch</Link>
        </>
      )}

      {['broker', 'admin'].includes(user?.role) && (
        <>
          <h2>CÔNG VIỆC MÔI GIỚI</h2>
          <Link to="/staff/properties" className={isActive('/staff/properties')}><Key size={18} /> Dashboard nhà & lịch hẹn</Link>
          <Link to="/staff/appointments" className={isActive('/staff/appointments')}><Calendar size={18} /> Quản lý lịch hẹn</Link>
          <Link to="/staff/history" className={isActive('/staff/history')}><History size={18} /> Nhật ký làm việc</Link>
          <Link to="/staff/commissions" className={isActive('/staff/commissions')}><DollarSign size={18} /> Hoa hồng & Thu nhập</Link>
          <Link to="/staff/transactions" className={isActive('/staff/transactions')}><History size={18} /> Lịch sử giao dịch</Link>
        </>
      )}

      {user?.role === 'admin' && (
        <>
          <h2>HỆ THỐNG</h2>
          <Link to="/admin/users" className={isActive('/admin/users')}><Users size={18} /> Quản lý tài khoản</Link>
        </>
      )}

      {user && (
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => { logoutUser(); navigate('/login'); }}
            className="btn-logout"
            style={{
              width: '100%',
              color: '#fc8181',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 10
            }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Đang tải...</div>;
  }

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
          <Route path="/landlord" element={<LandlordDashboard />} />
          <Route path="/deposit-request" element={<DepositRequest />} />
          <Route path="/staff/properties" element={<StaffProperties />} />
          <Route path="/staff/appointments" element={<StaffAppointments />} />
          <Route path="/staff/history" element={<StaffWorkHistory />} />
          <Route path="/staff/contracts" element={<StaffClosedContracts />} />
          <Route path="/staff/commissions" element={<StaffCommissions />} />
          <Route path="/staff/transactions" element={<StaffTransactions />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/contracts/deposit/:id" element={<ContractDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
