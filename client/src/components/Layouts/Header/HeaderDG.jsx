import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';
import LogoutConfirmationModal from '../../../components/User/LogoutConfirmationModal';
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
    }, 100); // 100ms delay before closing
  };
  
  const isDropdownOpen = (dropdownName) => activeDropdown === dropdownName;

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);

  useEffect(() => {
    // Check if we already have location data in localStorage
    const savedLocation = localStorage.getItem('userLocation');
    const savedPincode = localStorage.getItem('userPincode');

    if (savedLocation && savedPincode) {
      setUserLocation(savedLocation);
      setUserPincode(savedPincode);
      setHasFetchedLocation(true);
      return;
    }

    // Only fetch location if we don't have it saved
    if (navigator.geolocation && !hasFetchedLocation) {
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
            const locationText = location || 'Location not available';
            const pincode = address.postcode || 'NA';
            
            // Update state and localStorage
            setUserLocation(locationText);
            setUserPincode(pincode);
            localStorage.setItem('userLocation', locationText);
            localStorage.setItem('userPincode', pincode);
            setHasFetchedLocation(true);
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
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/products/${trimmedQuery}`);
    } else {
      enqueueSnackbar('Please enter a search term', { 
        variant: 'warning',
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        }
      });
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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser(() => {
        enqueueSnackbar("Logout Successful", { variant: "success" });
        setShowLogoutConfirm(false); // Close the modal
        // Don't navigate, stay on the same page
      }));
    } catch (error) {
      enqueueSnackbar("Failed to logout. Please try again.", { variant: "error" });
    }
  };

  return (
    <>
      <header
        style={{ backgroundColor: '#003366' }}
        className="fixed top-0 left-0 right-0 w-full px-16 z-50"
      >
        <div className="w-full mx-auto">
          <div className="h-16 flex items-center justify-between gap-4">
            {/** LEFT: Logo + Location */}
            <div className="flex items-center w-80 shrink-0">
              <Link to="/" className="text-2xl font-bold text-white whitespace-nowrap mr-4">
                <img src={Logo} alt='logo' className='w-[133.3px]' />
              </Link>
              
              { isAuthenticated ? (
                <div className="hidden md:flex items-center rounded px-2 py-1 w-40">
                  <div className="text-white font-medium text-sm flex items-center gap-1">
                    <img src={PinIcon} alt="pin" className="w-5 h-5" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-xs">Delivery to {user?.name?.split(' ')[0]}</span>
                      <span className="truncate text-sm text-gray-200">{userLocation}, {userPincode}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-40"></div>
              )}
            </div>

            {/** CENTER: Search Bar */}
            <div className="w-[470px] shrink-0">
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
            <div className="hidden md:flex items-center space-x-6 ml-auto">
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
                          <li><a href="/products/silk%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Silk Yarn</a></li>
                          <li><a href="/products/cotton%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Cotton Yarn</a></li>
                          <li><a href="/products/polyster%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Polyster Yarn</a></li>
                          <li><a href="/products/viscous%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Viscous Yarn</a></li>
                        </ul>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">ZARI</h3>
                        <ul className="space-y-1">
                          <li><a href="/products/flora%20zari" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Flora Zari</a></li>
                          <li><a href="/products/pure%20threads" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Pure Threads</a></li>
                          <li><a href="/products/metallic%20laces" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Metallic Laces</a></li>
                        </ul>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">Machinery</h3>
                        <ul className="space-y-1">
                          <li><a href="/products/all%20fabrics" className="text-sm text-gray-600 hover:text-blue-600 block py-1">All Fabrics</a></li>
                          <li><a href="/products/cotton%20fabrics" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Cotton Fabrics</a></li>
                          <li><a href="/products/silk%20fabrics" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Silk Fabrics</a></li>
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
                      <a href="/bulkorder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bulk Order Enquiry</a>
                      <a href="/bulkorder/policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bulk Order Policy</a>
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

            {/** RIGHT: Cart Icon + Login Button */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="flex items-center">
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
              </div>

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
                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden" style={{ maxWidth: '120px' }}>
                      {user?.name ? `Hey, ${user.name.split(' ')[0]}` : 'Account'}
                      {/* <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform inline ${isDropdownOpen('profile') ? 'transform rotate-180' : ''}`} /> */}
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
                          onClick={() => setShowLogoutConfirm(true)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center h-full">
                <Link
                  to="/login"
                  className="
                    h-9
                    px-5
                    flex
                    items-center
                    justify-center
                    bg-white
                    text-[#003366]
                    rounded-md
                    text-sm
                    font-medium
                    hover:bg-gray-50
                    transition-all
                    border border-transparent
                    hover:border-gray-200
                    shadow-sm
                    whitespace-nowrap
                  "
                >
                  Login
                </Link>
              </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <LogoutConfirmationModal 
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          handleLogout();
        }}
      />
    </>
  );
};

export default HeaderDG;