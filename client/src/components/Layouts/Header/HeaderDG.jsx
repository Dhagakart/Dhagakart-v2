// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useSnackbar } from 'notistack';
// import { logoutUser } from '../../../actions/userAction';
// import LogoutConfirmationModal from '../../../components/User/LogoutConfirmationModal';
// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import SearchIcon from '@mui/icons-material/Search';
// import { FaChevronDown } from 'react-icons/fa';
// import ProfileIcon from './profile.png';
// import Logo from './logo.png';
// import PinIcon from './Pin.png';

// const HeaderDG = () => {
//   const navigate = useNavigate();
//   const { cartItems } = useSelector((state) => state.cart);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userLocation, setUserLocation] = useState('Loading location...');
//   const [userPincode, setUserPincode] = useState('');
//   const [activeDropdown, setActiveDropdown] = useState(null); // 'category', 'bulkOrder', 'profile', or null
//   const dropdownRefs = {
//     category: useRef(null),
//     bulkOrder: useRef(null),
//     profile: useRef(null)
//   };
//   const dropdownTimeout = useRef(null);

//   // Close all other dropdowns when one is opened
//   const openDropdown = (dropdownName) => {
//     setActiveDropdown(dropdownName);
//     if (dropdownTimeout.current) {
//       clearTimeout(dropdownTimeout.current);
//     }
//   };

//   const closeDropdown = () => {
//     if (dropdownTimeout.current) {
//       clearTimeout(dropdownTimeout.current);
//     }
//     dropdownTimeout.current = setTimeout(() => {
//       setActiveDropdown(null);
//     }, 100); // 100ms delay before closing
//   };

//   const isDropdownOpen = (dropdownName) => activeDropdown === dropdownName;

//   const dispatch = useDispatch();
//   const { enqueueSnackbar } = useSnackbar();
//   const { isAuthenticated, user } = useSelector((state) => state.user);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [hasFetchedLocation, setHasFetchedLocation] = useState(false);

//   useEffect(() => {
//     // Check if we already have location data in localStorage
//     const savedLocation = localStorage.getItem('userLocation');
//     const savedPincode = localStorage.getItem('userPincode');

//     if (savedLocation && savedPincode) {
//       setUserLocation(savedLocation);
//       setUserPincode(savedPincode);
//       setHasFetchedLocation(true);
//       return;
//     }

//     // Only fetch location if we don't have it saved
//     if (navigator.geolocation && !hasFetchedLocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           try {
//             const { latitude, longitude } = position.coords;
//             // Fetch location details
//             const locationResponse = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
//             );
//             const locationData = await locationResponse.json();

//             // Extract relevant location information
//             const address = locationData.address;
//             const location = address.city || address.town || address.village || address.county || '';
//             const locationText = location || 'Location not available';
//             const pincode = address.postcode || 'NA';

//             // Update state and localStorage
//             setUserLocation(locationText);
//             setUserPincode(pincode);
//             localStorage.setItem('userLocation', locationText);
//             localStorage.setItem('userPincode', pincode);
//             setHasFetchedLocation(true);
//           } catch (error) {
//             console.error('Error fetching location details:', error);
//             setUserLocation('Enable location access');
//             setUserPincode('NA');
//           }
//         },
//         (error) => {
//           setUserLocation('Enable location access');
//           setUserPincode('NA');
//         }
//       );
//     } else {
//       setUserLocation('Geolocation not supported');
//       setUserPincode('NA');
//     }
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const trimmedQuery = searchQuery.trim();
//     if (trimmedQuery) {
//       navigate(`/products/${trimmedQuery}`);
//     } else {
//       enqueueSnackbar('Please enter a search term', { 
//         variant: 'warning',
//         autoHideDuration: 2000,
//         anchorOrigin: {
//           vertical: 'top',
//           horizontal: 'right',
//         }
//       });
//     }
//   };

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const isOutsideAll = Object.values(dropdownRefs).every(
//         ref => !ref.current?.contains(event.target)
//       );

//       if (isOutsideAll) {
//         closeDropdown();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
//     };
//   }, []);

//   const handleMouseEnter = (dropdownName) => {
//     if (dropdownTimeout.current) {
//       clearTimeout(dropdownTimeout.current);
//     }
//     openDropdown(dropdownName);
//   };

//   const handleMouseLeave = () => {
//     closeDropdown();
//   };

//   const handleLogout = async () => {
//     try {
//       await dispatch(logoutUser(() => {
//         enqueueSnackbar("Logout Successful", { variant: "success" });
//         setShowLogoutConfirm(false); // Close the modal
//         // Don't navigate, stay on the same page
//       }));
//     } catch (error) {
//       enqueueSnackbar("Failed to logout. Please try again.", { variant: "error" });
//     }
//   };

//   return (
//     <>
//       <header
//         style={{ backgroundColor: '#003366' }}
//         className="fixed top-0 left-0 right-0 w-full px-16 z-50"
//       >
//         <div className="w-full mx-auto">
//           <div className="h-16 flex items-center justify-between gap-4">
//             {/** LEFT: Logo + Location */}
//             <div className="flex items-center w-80 shrink-0">
//               <Link to="/" className="text-2xl font-bold text-white whitespace-nowrap mr-4">
//                 <img src={Logo} alt='logo' className='w-[133.3px]' />
//               </Link>

//               { isAuthenticated ? (
//                 <div className="hidden md:flex items-center rounded px-2 py-1 w-40">
//                   <div className="text-white font-medium text-sm flex items-center gap-1">
//                     <img src={PinIcon} alt="pin" className="w-5 h-5" />
//                     <div className="flex flex-col min-w-0">
//                       <span className="truncate text-xs">Delivery to {user?.name?.split(' ')[0]}</span>
//                       <span className="truncate text-sm text-gray-200">{userLocation}, {userPincode}</span>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="w-40"></div>
//               )}
//             </div>

//             {/** CENTER: Search Bar */}
//             <div className="w-[470px] shrink-0">
//               <form onSubmit={handleSearch} className="w-full flex bg-white rounded-sm overflow-hidden shadow-md">
//                 <input
//                   type="text"
//                   placeholder="Search for products, brands and more"
//                   className="text-sm w-full outline-none border-none px-4 py-2 placeholder-gray-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button 
//                   type="submit" 
//                   className="px-4 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
//                 >
//                   <SearchIcon />
//                 </button>
//               </form>
//             </div>

//             {/** RIGHT: Navigation Links */}
//             <div className="hidden md:flex items-center space-x-6 ml-auto">
//               <div 
//                 className="relative py-2"
//                 ref={dropdownRefs.category}
//                 onMouseEnter={() => handleMouseEnter('category')}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <button
//                   onClick={() => isDropdownOpen('category') ? closeDropdown() : openDropdown('category')}
//                   className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap focus:outline-none hover:cursor-pointer"
//                 >
//                   <span>Category</span>
//                   <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform ${isDropdownOpen('category') ? 'transform rotate-180' : ''}`} />
//                 </button>
//                 {isDropdownOpen('category') && (
//                   <div 
//                     className="absolute z-50 mt-4 w-96 px-4 -left-40 bg-white rounded-lg shadow-lg overflow-hidden"
//                     onMouseEnter={() => handleMouseEnter('category')}
//                     onMouseLeave={handleMouseLeave}
//                   >
//                     <div className="grid grid-cols-3">
//                       <div className="p-3">
//                         <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">YARNS</h3>
//                         <ul className="space-y-1">
//                           <li><a href="/products/silk%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Silk Yarn</a></li>
//                           <li><a href="/products/cotton%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Cotton Yarn</a></li>
//                           <li><a href="/products/polyster%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Polyster Yarn</a></li>
//                           <li><a href="/products/viscous%20yarn" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Viscous Yarn</a></li>
//                         </ul>
//                       </div>
//                       <div className="p-3">
//                         <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">ZARI</h3>
//                         <ul className="space-y-1">
//                           <li><a href="/products/flora%20zari" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Flora Zari</a></li>
//                           <li><a href="/products/pure%20threads" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Pure Threads</a></li>
//                           <li><a href="/products/metallic%20laces" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Metallic Laces</a></li>
//                         </ul>
//                       </div>
//                       <div className="p-3">
//                         <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">Machinery</h3>
//                         <ul className="space-y-1">
//                           <li><a href="/products/all%20fabrics" className="text-sm text-gray-600 hover:text-blue-600 block py-1">All Fabrics</a></li>
//                           <li><a href="/products/cotton%20fabrics" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Cotton Fabrics</a></li>
//                           <li><a href="/products/silk%20fabrics" className="text-sm text-gray-600 hover:text-blue-600 block py-1">Silk Fabrics</a></li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div 
//                 className="relative py-2"
//                 ref={dropdownRefs.bulkOrder}
//                 onMouseEnter={() => handleMouseEnter('bulkOrder')}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <button
//                   onClick={() => isDropdownOpen('bulkOrder') ? closeDropdown() : openDropdown('bulkOrder')}
//                   className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap focus:outline-none hover:cursor-pointer"
//                 >
//                   <span>Bulk Order</span>
//                   <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform ${isDropdownOpen('bulkOrder') ? 'transform rotate-180' : ''}`} />
//                 </button>
//                 {isDropdownOpen('bulkOrder') && (
//                   <div 
//                     className="absolute z-50 mt-2 w-48 mt-4 bg-white rounded-md shadow-lg overflow-hidden"
//                     onMouseEnter={() => handleMouseEnter('bulkOrder')}
//                     onMouseLeave={handleMouseLeave}
//                   >
//                     <div className="p-2">
//                       <a href="/bulkorder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bulk Order Enquiry</a>
//                       <a href="/bulkorder/policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Bulk Order Policy</a>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Link
//                 to="/reqcredits"
//                 className="text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap"
//               >
//                 Credit Finance
//               </Link>
//             </div>

//             {/** RIGHT: Cart Icon + Login Button */}
//             <div className="flex items-center space-x-4 ml-4">
//               <div className="flex items-center">
//                 <Link
//                   to="/cart"
//                   className="relative text-white hover:text-gray-200 transition-colors"
//                 >
//                   <ShoppingCartOutlinedIcon style={{ fontSize: 24 }} />
//                   <span
//                     className="
//                       absolute 
//                       -top-1 
//                       -right-2 
//                       bg-white 
//                       text-[#003366] 
//                       text-xs 
//                       font-bold 
//                       rounded-full 
//                       h-4 
//                       w-4 
//                       flex 
//                       items-center 
//                       justify-center
//                     "
//                   >
//                     {cartItems.length || 0}
//                   </span>
//                 </Link>
//               </div>

//               { isAuthenticated ? (
//                 <div 
//                   className="relative py-2"
//                   ref={dropdownRefs.profile}
//                   onMouseEnter={() => handleMouseEnter('profile')}
//                   onMouseLeave={handleMouseLeave}
//                 >
//                   <button
//                     onClick={() => isDropdownOpen('profile') ? closeDropdown() : openDropdown('profile')}
//                     className="flex items-center text-white hover:text-gray-200 transition-colors space-x-1 focus:outline-none"
//                   >
//                     <img src={ProfileIcon} alt="Profile" className="w-8 h-8 rounded-full" />
//                     <span className="text-sm font-medium whitespace-nowrap overflow-hidden" style={{ maxWidth: '120px' }}>
//                       {user?.name ? `Hey, ${user.name.split(' ')[0]}` : 'Account'}
//                       {/* <FaChevronDown className={`ml-1 text-xs text-gray-100 transition-transform inline ${isDropdownOpen('profile') ? 'transform rotate-180' : ''}`} /> */}
//                     </span>
//                   </button>
//                   {isDropdownOpen('profile') && (
//                     <div 
//                       className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50"
//                       onMouseEnter={() => handleMouseEnter('profile')}
//                       onMouseLeave={handleMouseLeave}
//                     >
//                       <div className="p-2">
//                         <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">My Account</Link>
//                         <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">My Orders</Link>
//                         <button
//                           onClick={() => setShowLogoutConfirm(true)}
//                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
//                         >
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex items-center h-full">
//                 <Link
//                   to="/login"
//                   className="
//                     h-9
//                     px-5
//                     flex
//                     items-center
//                     justify-center
//                     bg-white
//                     text-[#003366]
//                     rounded-md
//                     text-sm
//                     font-medium
//                     hover:bg-gray-50
//                     transition-all
//                     border border-transparent
//                     hover:border-gray-200
//                     shadow-sm
//                     whitespace-nowrap
//                   "
//                 >
//                   Login
//                 </Link>
//               </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <LogoutConfirmationModal 
//         isOpen={showLogoutConfirm}
//         onCancel={() => setShowLogoutConfirm(false)}
//         onConfirm={() => {
//           handleLogout();
//         }}
//       />
//     </>
//   );
// };

// export default HeaderDG;

import React, { useState, useEffect, useRef } from 'react';
import { useCallback } from 'react';
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
import { Drawer, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Headroom from 'react-headroom';
import MobileNav from './MobileNav';
import MobileSearchBar from './MobileSearchbar';
import axios from 'axios';

const HeaderDG = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef(null);
  const searchRef = useRef(null);
  const [userLocation, setUserLocation] = useState('Loading location...');
  const [userPincode, setUserPincode] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRefs = {
    category: useRef(null),
    bulkOrder: useRef(null),
    profile: useRef(null),
  };
  const dropdownTimeout = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const openDropdown = (dropdownName) => {
    setActiveDropdown(dropdownName);
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
  };

  const closeDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 100);
  };

  const isDropdownOpen = (dropdownName) => activeDropdown === dropdownName;

  const fetchSuggestions = useCallback(async (keyword) => {
    if (keyword.trim()) {
      try {
        setIsLoading(true);
        // const response = await axios.get(`http://localhost:4000/api/v1/search/suggestions?keyword=${keyword}`);
        const response = await axios.get(`https://dhagakart.onrender.com/api/v1/search/suggestions?keyword=${keyword}`);
        setSearchSuggestions(response.data.suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        enqueueSnackbar('Failed to fetch search suggestions', {
          variant: 'error',
          autoHideDuration: 2000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [enqueueSnackbar]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  }, [fetchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/products/${trimmedQuery}`);
      setShowSuggestions(false);
    } else {
      enqueueSnackbar('Please enter a search term', {
        variant: 'warning',
        autoHideDuration: 2000,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
    }
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedPincode = localStorage.getItem('userPincode');

    if (savedLocation && savedPincode) {
      setUserLocation(savedLocation);
      setUserPincode(savedPincode);
      setHasFetchedLocation(true);
      return;
    }

    if (navigator.geolocation && !hasFetchedLocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const locationData = await locationResponse.json();
            const address = locationData.address;
            const location =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              '';
            const locationText = location || 'Location not available';
            const pincode = address.postcode || 'NA';

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
  }, [hasFetchedLocation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdowns = Object.values(dropdownRefs).every(
        (ref) => !ref.current?.contains(event.target)
      );
      const isOutsideSearch = searchRef.current && !searchRef.current.contains(event.target);
      if (isOutsideDropdowns) closeDropdown();
      if (isOutsideSearch && showSuggestions) setShowSuggestions(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, [dropdownRefs, showSuggestions]);

  const handleMouseEnter = (dropdownName) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    openDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    closeDropdown();
  };

  const handleLogout = async () => {
    try {
      await dispatch(
        logoutUser(() => {
          enqueueSnackbar('Logout Successful', { variant: 'success' });
          setShowLogoutConfirm(false);
        })
      );
    } catch (error) {
      enqueueSnackbar('Failed to logout. Please try again.', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Headroom
        onUnpin={() => {
          setIsNavbarHidden(true);
          setTimeout(() => setIsNavbarHidden(true), 100);
        }}
        onPin={() => setIsNavbarHidden(false)}
        style={{
          zIndex: 1300,
          position: 'fixed',
          width: '100%',
          transform: 'translateY(0)',
          transition: 'transform 200ms ease-in-out',
        }}
        pinStart={0}
        upTolerance={5}
        downTolerance={5}
      >
        <header
          style={{ backgroundColor: '#003366' }}
          className="top-0 left-0 right-0 w-full px-4 md:px-12"
        >
          <div className="w-full mx-auto">
            <div className="h-16 flex items-center justify-between gap-4">
              {/* LEFT: Logo + Location */}
              <div className="flex items-center w-auto md:w-80 shrink-0">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1, display: { md: 'none' }, color: 'white' }}
                >
                  <MenuIcon />
                </IconButton>
                <Link to="/" className="text-2xl font-bold text-white whitespace-nowrap mr-4">
                  <img src={Logo} alt="logo" className="w-[133.3px]" />
                </Link>
                {isAuthenticated ? (
                  <div className="hidden md:flex items-center rounded px-2 py-1 w-40">
                    <div className="text-white font-medium text-sm flex items-center gap-1">
                      <img src={PinIcon} alt="pin" className="w-5 h-5" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-xs">
                          Delivery to {user?.name?.split(' ')[0]}
                        </span>
                        <span className="truncate text-sm text-gray-200">
                          {userLocation}, {userPincode}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-40"></div>
                )}
              </div>

              {/* CENTER: Search Bar */}
              <div className="hidden md:block w-[470px] shrink-0 relative" ref={searchRef}>
                <form
                  onSubmit={handleSearch}
                  className="w-full flex bg-white rounded-md overflow-hidden shadow-md"
                >
                  <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    className="text-sm w-full outline-none border-none px-4 py-2.5 placeholder-gray-400"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="px-4 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                  >
                    <SearchIcon />
                  </button>
                </form>
                {showSuggestions && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto border border-gray-200">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-600"></div>
                      </div>
                    ) : searchSuggestions?.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {searchSuggestions.map((suggestion) => (
                          <li
                            key={suggestion._id}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <Link
                              to={`/product/${suggestion._id}`}
                              className="flex items-center space-x-4 focus:outline-none rounded-md"
                              onClick={() => setShowSuggestions(false)}
                            >
                              {suggestion.image && (
                                <img
                                  src={suggestion.image}
                                  alt={suggestion.name}
                                  className="w-12 h-12 object-cover rounded-md border border-gray-200"
                                />
                              )}
                              <div className="flex-1 flex flex-col">
                                <span className="text-base font-medium text-gray-900 line-clamp-1">
                                  {suggestion.name}
                                </span>
                                <span className="text-sm text-gray-500 line-clamp-1">{suggestion.category}</span>
                                <span className="text-sm font-semibold text-gray-700">₹{suggestion.price}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-4 text-gray-500 text-sm font-medium text-center">
                        No suggestions found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Navigation Links + Cart + Profile */}
              <div className="flex items-center space-x-4 ml-auto">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  {/* Category Dropdown */}
                  <div
                    className="relative py-2"
                    ref={dropdownRefs.category}
                    onMouseEnter={() => handleMouseEnter('category')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() =>
                        isDropdownOpen('category')
                          ? closeDropdown()
                          : openDropdown('category')
                      }
                      className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap focus:outline-none hover:cursor-pointer"
                    >
                      <span>Category</span>
                      <FaChevronDown
                        className={`ml-1 text-xs text-gray-100 transition-transform ${isDropdownOpen('category') ? 'transform rotate-180' : ''
                          }`}
                      />
                    </button>
                    {isDropdownOpen('category') && (
                      <div
                        className="absolute z-50 mt-4 w-96 px-4 -left-40 bg-white rounded-lg shadow-lg overflow-hidden"
                        onMouseEnter={() => handleMouseEnter('category')}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="grid grid-cols-3 p-3">
                          <div>
                            <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">YARNS</h3>
                            <ul className="space-y-1">
                              <li>
                                <a
                                  href="/products/silk%20yarn"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Silk Yarn
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/cotton%20yarn"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Cotton Yarn
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/polyester%20yarn"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Polyester Yarn
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/viscose%20yarn"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Viscose Yarn
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">ZARI</h3>
                            <ul className="space-y-1">
                              <li>
                                <a
                                  href="/products/flora%20zari"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Flora Zari
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/metallic%20zari"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Metallic Zari
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/zari"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Zari
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/pure%20zari"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Pure Zari
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-xs text-gray-400 mb-2 px-2 py-2">Machinery</h3>
                            <ul className="space-y-1">
                              <li>
                                <a
                                  href="/products/jack"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Sewing Machine
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/products/power%20loom"
                                  className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                                >
                                  Powerloom
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bulk Order Dropdown */}
                  <div
                    className="relative py-2"
                    ref={dropdownRefs.bulkOrder}
                    onMouseEnter={() => handleMouseEnter('bulkOrder')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() =>
                        isDropdownOpen('bulkOrder')
                          ? closeDropdown()
                          : openDropdown('bulkOrder')
                      }
                      className="flex items-center text-sm font-medium text-gray-100 hover:text-white transition-colors whitespace-nowrap focus:outline-none hover:cursor-pointer"
                    >
                      <span>Bulk Order</span>
                      <FaChevronDown
                        className={`ml-1 text-xs text-gray-100 transition-transform ${isDropdownOpen('bulkOrder') ? 'transform rotate-180' : ''
                          }`}
                      />
                    </button>
                    {isDropdownOpen('bulkOrder') && (
                      <div
                        className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden"
                        onMouseEnter={() => handleMouseEnter('bulkOrder')}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-2">
                          <a
                            href="/bulkorder"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Bulk Order Enquiry
                          </a>
                          <a
                            href="/bulkorder/policy"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Bulk Order Policy
                          </a>
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

                {/* Cart Icon */}
                <div className="flex items-center">
                  <Link
                    to="/cart"
                    className="relative flex items-center text-gray-100 hover:text-white transition-colors"
                  >
                    <ShoppingCartOutlinedIcon className="text-2xl" />
                    {cartItems?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {cartItems?.length}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Profile / Login */}
                {isAuthenticated ? (
                  <div
                    className="relative py-2 hidden md:block"
                    ref={dropdownRefs.profile}
                    onMouseEnter={() => handleMouseEnter('profile')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() =>
                        isDropdownOpen('profile')
                          ? closeDropdown()
                          : openDropdown('profile')
                      }
                      className="flex items-center text-white hover:text-gray-200 transition-colors space-x-1 focus:outline-none"
                    >
                      <img
                        src={ProfileIcon}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <span
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        style={{ maxWidth: '120px' }}
                      >
                        {user?.name ? `Hey, ${user.name.split(' ')[0]}` : 'Account'}
                      </span>
                    </button>
                    {isDropdownOpen('profile') && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50"
                        onMouseEnter={() => handleMouseEnter('profile')}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="p-2">
                          <Link
                            to="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            My Account
                          </Link>
                          <Link
                            to="/account/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            My Orders
                          </Link>
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
                  <div className="hidden md:flex items-center h-full">
                    <Link
                      to="/login"
                      className="h-9 px-5 flex items-center justify-center bg-white text-[#003366] rounded-md text-sm font-medium hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 shadow-sm whitespace-nowrap"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </Headroom>

      <div className="md:hidden" style={{ height: '56px' }}>
        <MobileSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isNavbarHidden={isNavbarHidden}
        />
      </div>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          },
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1500,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            position: 'absolute',
            height: '100vh',
            zIndex: 1501,
          },
        }}
      >
        <MobileNav
          handleDrawerToggle={handleDrawerToggle}
          isAuthenticated={isAuthenticated}
          user={user}
          setShowLogoutConfirm={setShowLogoutConfirm}
        />
      </Drawer>

      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default HeaderDG;