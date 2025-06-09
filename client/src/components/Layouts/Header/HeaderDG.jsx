import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { FaChevronDown } from 'react-icons/fa';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HeaderDG = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Loading location...');
  const [userPincode, setUserPincode] = useState('');

  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Fetch location details
            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const locationData = await locationResponse.json();
            
            // Extract relevant location information
            const address = locationData.address;
            const location = address.city || address.town || address.village || address.county || '';
            setUserLocation(location || 'Location not available');

            // Get pincode from the same location data
            setUserPincode(address.postcode || 'Pincode not available');
          } catch (error) {
            console.error('Error fetching location details:', error);
            setUserLocation('Enable location access');
            setUserPincode('Pincode not available');
          }
        },
        (error) => {
          setUserLocation('Enable location access');
          setUserPincode('Pincode not available');
        }
      );
    } else {
      setUserLocation('Geolocation not supported');
      setUserPincode('Pincode not available');
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/${searchQuery.trim()}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header
      // Exact navy background: #003366
      style={{ backgroundColor: '#003366' }}
      className="w-full -mb-10 px-16"
    >
      <div className="w-full">
        <div className="h-16 flex items-center justify-between gap-4">
          {/** LEFT: Logo + Location */}
          <div className="flex items-center min-w-0">
            <Link to="/" className="text-2xl font-bold text-white whitespace-nowrap mr-6">
              DhagaKart
            </Link>
            
            { isAuthenticated ? (
              <div className="hidden md:flex items-center rounded px-2 py-1">
                <div className="text-white font-medium text-sm">
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{userLocation}</span>
                    <span className="text-xs text-gray-200">Pincode: {userPincode}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                
              </div>
            )}
          </div>

          {/** CENTER: Search Bar */}
          <div className="flex-1 max-w-xl ml-12">
            <form onSubmit={handleSearch} className="w-full flex bg-white rounded-sm overflow-hidden shadow-md">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="text-sm w-full outline-none border-none px-4 py-2 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="px-4 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
              >
                <SearchIcon />
              </button>
            </form>
          </div>

          {/** RIGHT: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 min-w-0">
            <Link
              to="#"
              className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap"
            >
              <span>Category</span>
              <FaChevronDown className="ml-1 text-xs text-gray-100" />
            </Link>

            <Link
              to="/bulk-order"
              className="text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap"
            >
              Bulk Order
            </Link>

            <Link
              to="/credit-finance"
              className="text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap"
            >
              Credit Finance
            </Link>
          </div>


          {/**=============================================== */}
          {/** 3) RIGHT: Cart Icon + Login Button          **/}
          {/**=============================================== */}
          <div className="flex items-center space-x-8">
            {/* 
              Cart with badge:
              - Icon size = 24px 
              - Badge: 16×16px white circle, navy text. 
                Positioned -4px from top, -8px from right of the icon.
            */}
            <Link
              to="/cart"
              className="relative text-white hover:text-gray-200 transition-colors"
            >
              <ShoppingCartOutlinedIcon style={{ fontSize: 24 }} />
              <span
                className="
                  absolute 
                  -top-1 
                  -right-2 
                  bg-white 
                  text-[#003366] 
                  text-xs 
                  font-bold 
                  rounded-full 
                  h-4 
                  w-4 
                  flex 
                  items-center 
                  justify-center
                "
              >
                {cartItems.length || 0}
              </span>
            </Link>

            {/*
              Login button:
              - Height=32px (h-8), 
              - Horizontal padding=px-4 (16px each side), 
              - Rounded corners=rounded-md (6px radius). 
              - Background=white, text=#003366 (navy), 
              - Font=text-sm (14px), font-medium,
              - Hover→bg-gray-100 for a subtle light‐gray background. 
            */}
            { isAuthenticated ? (
              <Link
                to="/account"
                className="flex items-center text-white hover:text-gray-200 transition-colors space-x-1"
              >
                <AccountCircleIcon style={{ fontSize: 24 }} />
                <span className="text-sm font-medium">
                  {'Hey, ' + user?.name?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : (
              <Link
              to="/login"
              className="
                h-8 
                px-4 
                flex 
                items-center 
                justify-center 
                bg-white 
                text-[#003366] 
                rounded-md 
                text-sm 
                font-medium 
                hover:bg-gray-100 
                transition-colors
              "
            >
              Login
            </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default HeaderDG;
