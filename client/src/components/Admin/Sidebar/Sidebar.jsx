import { useCallback, memo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Equalizer as EqualizerIcon,
  ShoppingBag as ShoppingBagIcon,
  Inventory as InventoryIcon,
  Group as GroupIcon,
  Reviews as ReviewsIcon,
  AddBox as AddBoxIcon,
  Logout as LogoutIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';
import React from 'react';

const navMenu = [
  { icon: <EqualizerIcon />, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: <ShoppingBagIcon />, label: 'Orders', to: '/admin/orders' },
  { icon: <InventoryIcon />, label: 'Products', to: '/admin/products' },
  { icon: <AddBoxIcon />, label: 'Add Product', to: '/admin/new_product' },
  { icon: <GroupIcon />, label: 'Users', to: '/admin/users' },
  { icon: <ReviewsIcon />, label: 'Reviews', to: '/admin/reviews' },
  { icon: <AccountBoxIcon />, label: 'My Profile', to: '/account' },
  { icon: <LogoutIcon />, label: 'Logout' },
];

const NavItem = ({ icon, label, isActive, to, onClick }) => {
  const className = `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg mx-2 transition-all duration-200 ${
    isActive 
      ? 'bg-blue-600 text-white shadow-lg' 
      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
  }`;

  const iconWithClass = React.cloneElement(icon, { className: 'w-6 h-6' });

  if (to) {
    return (
      <Link to={to} className={className} aria-label={label}>
        <span className="flex-shrink-0">{iconWithClass}</span>
        <span className="whitespace-nowrap text-sm font-medium">{label}</span>
      </Link>
    );
  } else {
    return (
      <button onClick={onClick} className={className} aria-label={label}>
        <span className="flex-shrink-0">{iconWithClass}</span>
        <span className="whitespace-nowrap text-sm font-medium">{label}</span>
      </button>
    );
  }
};

const UserProfile = ({ user }) => (
  <div className="p-4 border-t border-gray-700">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {user.name?.charAt(0)?.toUpperCase()}
      </div>
      <div className="overflow-hidden">
        <p className="text-sm font-medium truncate">{user.name}</p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
      </div>
    </div>
  </div>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    navigate('/login');  
  }, [dispatch, enqueueSnackbar, navigate]);

  return (
    <aside 
      className="fixed top-0 left-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ paddingTop: '60px' }}
    >
      <div className="h-full flex flex-col">
        <nav className="flex-1 overflow-y-auto py-4">
          {navMenu.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              to={item.to}
              onClick={item.label === 'Logout' ? handleLogout : undefined}
            />
          ))}
        </nav>
        {user && <UserProfile user={user} />}
      </div>
    </aside>
  );
};

export default memo(Sidebar);