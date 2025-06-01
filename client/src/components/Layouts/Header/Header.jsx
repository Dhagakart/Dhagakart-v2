import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Searchbar from './Searchbar';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';
import SecondaryDropDownMenu from './SecondaryDropDownMenu';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [toggleSecondaryDropDown, setToggleSecondaryDropDown] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="block h-8 w-auto">
              <img 
                className="h-full w-auto" 
                src={logo} 
                alt="Logo"
                draggable="false"
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <Searchbar />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
                  className="flex items-center text-sm text-white hover:text-gray-200 focus:outline-none transition-colors"
                >
                  <span className="hidden sm:inline-block mr-1 font-medium">
                    {user?.name?.split(" ", 1) || 'Account'}
                  </span>
                  <span className="flex items-center">
                    {togglePrimaryDropDown ? (
                      <ExpandLessIcon className="h-5 w-5" />
                    ) : (
                      <ExpandMoreIcon className="h-5 w-5" />
                    )}
                  </span>
                </button>
                {togglePrimaryDropDown && (
                  <PrimaryDropDownMenu 
                    setTogglePrimaryDropDown={setTogglePrimaryDropDown} 
                    user={user} 
                  />
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Login / Sign Up
              </Link>
            )}

            <div className="relative">
              <button 
                onClick={() => setToggleSecondaryDropDown(!toggleSecondaryDropDown)}
                className="flex items-center text-sm text-white hover:text-gray-200 focus:outline-none transition-colors"
              >
                <span className="hidden sm:inline-block mr-1 font-medium">More</span>
                <span className="flex items-center">
                  {toggleSecondaryDropDown ? (
                    <ExpandLessIcon className="h-5 w-5" />
                  ) : (
                    <ExpandMoreIcon className="h-5 w-5" />
                  )}
                </span>
              </button>
              {toggleSecondaryDropDown && <SecondaryDropDownMenu />}
            </div>
          </nav>

          <Link to="/cart" className="flex items-center text-white font-medium gap-2 relative">
            <span><ShoppingCartIcon /></span>
            {cartItems.length > 0 &&
              <div className="w-5 h-5 p-2 bg-red-500 text-xs rounded-full absolute -top-2 left-3 flex justify-center items-center border">
                {cartItems.length}
              </div>
            }
            Cart
          </Link>
        </div>
        {/* <!-- right navs --> */}

      </div>
      {/* <!-- navbar container --> */}
    </header>
  )
};

export default Header;
