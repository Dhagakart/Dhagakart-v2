import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { FaChevronDown } from 'react-icons/fa';
import ProfileIcon from './profile.png';
import Logo from './logo.png';
import PinIcon from './Pin.png';

const HeaderDG = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('Loading location...');
  const [userPincode, setUserPincode] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'category', 'bulkOrder', 'profile', or null
  const dropdownRefs = {
    category: useRef(null),
    bulkOrder: useRef(null),
    profile: useRef(null)
  };
  const dropdownTimeout = useRef(null);
  
  // Close all other dropdowns when one is opened
  const openDropdown = (dropdownName) => {
    setActiveDropdown(dropdownName);
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
  };
  
  const closeDropdown = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100); // 10ms delay before closing
  };
  
  const isDropdownOpen = (dropdownName) => activeDropdown === dropdownName;

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
            setUserPincode(address.postcode || 'NA');
          } catch (error) {
            console.error('Error fetching location details:', error);
            setUserLocation('Enable location access');
            setUserPincode('NA');
          }
        },
        (error) => {
          setUserLocation('Enable location access');
          setUserPincode('NA');
        }
      );
    } else {
      setUserLocation('Geolocation not supported');
      setUserPincode('NA');
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideAll = Object.values(dropdownRefs).every(
        ref => !ref.current?.contains(event.target)
      );
      
      if (isOutsideAll) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const handleMouseEnter = (dropdownName) => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    openDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    closeDropdown();
  };

  const handleLogout = () => {
    // Add your actual logout logic here
    console.log('Logging out...');
    // Example: 
    // dispatch(logoutUser());
    // navigate('/login');
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
              <img src={Logo} alt='logo' className='w-[133.3px]' />
            </Link>
            
            { isAuthenticated ? (
              <div className="hidden md:flex items-center rounded px-2 py-1">
                <div className="text-white font-medium text-sm flex items-center gap-2">
                  <img src={PinIcon} alt="pin" className="w-6 h-6" />
                  <div className="flex flex-col min-w-0">
                    {/* <span className="truncate">{userLocation}</span> */}
                    <span className="truncate text-xs">Delivery to {user?.name?.split(' ')[0]}</span>
                    {/* <span className="text-xs text-gray-200">Pincode: {userPincode}</span> */}
                    <span className="text-sm text-gray-200">{userLocation}, {userPincode}</span>
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
            <div 
              className="relative py-2"
              ref={dropdownRefs.category}
              onMouseEnter={() => handleMouseEnter('category')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => isDropdownOpen('category') ? closeDropdown() : openDropdown('category')}
                className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap focus:outline-none hover:cursor-pointer"
              >
                <span>Category</span>
                <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform ${isDropdownOpen('category') ? 'transform rotate-180' : ''}`} />
              </button>
              {isDropdownOpen('category') && (
                <div 
                  className="absolute z-50 mt-4 w-96 px-4 -left-40 bg-white rounded-lg shadow-lg overflow-hidden"
                  onMouseEnter={() => handleMouseEnter('category')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-3">
                    <div className="p-3">
                      <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">YARNS</h3>
                      <ul className="space-y-1">
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Silk Yarn</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Cotton Yarn</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Polyster Yarn</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Viscous Yarn</a></li>
                      </ul>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">ZARI</h3>
                      <ul className="space-y-1">
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Flora Zari</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Pure Threads</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Metallic Laces</a></li>
                      </ul>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">Machinary</h3>
                      <ul className="space-y-1">
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">All Fabrics</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Cotton Fabrics</a></li>
                        <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Silk Fabrics</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative py-2"
              ref={dropdownRefs.bulkOrder}
              onMouseEnter={() => handleMouseEnter('bulkOrder')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => isDropdownOpen('bulkOrder') ? closeDropdown() : openDropdown('bulkOrder')}
                className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap focus:outline-none hover:cursor-pointer"
              >
                <span>Bulk Order</span>
                <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform ${isDropdownOpen('bulkOrder') ? 'transform rotate-180' : ''}`} />
              </button>
              {isDropdownOpen('bulkOrder') && (
                <div 
                  className="absolute z-50 mt-2 w-48 mt-4 bg-white rounded-md shadow-lg overflow-hidden"
                  onMouseEnter={() => handleMouseEnter('bulkOrder')}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bulk Order Enquiry</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Track Bulk Order</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bulk Order Policy</a>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/reqcredits"
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
              <div 
                className="relative py-2"
                ref={dropdownRefs.profile}
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => isDropdownOpen('profile') ? closeDropdown() : openDropdown('profile')}
                  className="flex items-center text-white hover:text-gray-200 transition-colors space-x-1 focus:outline-none"
                >
                  <img src={ProfileIcon} alt="Profile" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium">
                    {user?.name ? `Hey, ${user.name.split(' ')[0]}` : 'Account'}
                    <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform inline ${isDropdownOpen('profile') ? 'transform rotate-180' : ''}`} />
                  </span>
                </button>
                {isDropdownOpen('profile') && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50"
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-2">
                      <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">My Account</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">My Orders</Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
