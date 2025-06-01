import { useCallback, memo } from 'react';
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
  Close as CloseIcon,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';
import './Sidebar.css'; // Optional, remove if unused

const navMenu = [
  { icon: <EqualizerIcon />, label: 'Dashboard', ref: '/admin/dashboard' },
  { icon: <ShoppingBagIcon />, label: 'Orders', ref: '/admin/orders' },
  { icon: <InventoryIcon />, label: 'Products', ref: '/admin/products' },
  { icon: <AddBoxIcon />, label: 'Add Product', ref: '/admin/new_product' },
  { icon: <GroupIcon />, label: 'Users', ref: '/admin/users' },
  { icon: <ReviewsIcon />, label: 'Reviews', ref: '/admin/reviews' },
  { icon: <AccountBoxIcon />, label: 'My Profile', ref: '/account' },
  { icon: <LogoutIcon />, label: 'Logout' },
];

const Sidebar = ({ setToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    navigate('/login');
  }, [dispatch, enqueueSnackbar, navigate]);

  return (
    <aside className="sidebar fixed left-0 z-10 sm:z-0 block min-h-screen max-h-screen w-3/4 sm:w-1/5 bg-gray-800 text-white border-r overflow-x-hidden pb-14">
      <header className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-lg my-4 mx-3.5">
        <Avatar
          alt={user?.name || 'Avatar'}
          src={user?.avatar?.url}
          sx={{ width: 40, height: 40 }}
        />
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-lg">{user?.name}</span>
          <span className="text-gray-300 text-sm">{user?.email}</span>
        </div>
        <button
          aria-label="Close sidebar"
          onClick={() => setToggleSidebar(false)}
          className="sm:hidden ml-auto rounded-full w-10 h-10 flex items-center justify-center bg-gray-800"
        >
          <CloseIcon fontSize="small" />
        </button>
      </header>

      <nav className="flex flex-col gap-0 my-8">
        {navMenu.map(({ icon, label, ref }) =>
          label === 'Logout' ? (
            <button
              key="logout"
              onClick={handleLogout}
              className="hover:bg-gray-700 flex gap-3 items-center py-3 px-4 font-medium text-left"
            >
              {icon}
              <span>{label}</span>
            </button>
          ) : (
            <Link
              key={ref}
              to={ref}
              className={`${
                location.pathname === ref ? 'bg-gray-700' : 'hover:bg-gray-700'
              } flex gap-3 items-center py-3 px-4 font-medium`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          )
        )}
      </nav>

      <footer className="mt-auto mb-6 mx-3.5 bg-gray-700 p-3 rounded-lg shadow-lg">
        <h5>Developed with ❤️ by:</h5>
        <div className="flex flex-col">
          <a
            href="https://www.linkedin.com/in/jigar-sable"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-lg hover:text-blue-500"
          >
            Jigar Sable
          </a>
          <a
            href="mailto:jigarsable21@gmail.com"
            className="text-gray-300 text-sm hover:text-blue-500"
          >
            jigarsable21@gmail.com
          </a>
        </div>
      </footer>
    </aside>
  );
};

export default memo(Sidebar);
