import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { FaChevronDown } from 'react-icons/fa';

const HeaderDG = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');

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
      className="w-full -mb-10"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* 
          Container height = 56px (h-14). 
          All items aligned center.
        */}
        <div className="h-16 flex items-center justify-between">

          {/**=============================================== */}
          {/** 1) LEFT: Logo + Nav Links                   **/}
          {/**=============================================== */}
          <div className="flex items-center">
            {/* 
              “DhagaKart”: 
              - text‐2xl (≈24px), font‐bold, white 
              - margin-left: 32px (ml-8) from left edge 
              - margin-right: 24px (mr-6) before nav 
            */}
            <Link to="/" className="text-2xl font-bold text-white ml-8 mr-6">
              DhagaKart
            </Link>

            {/* 
              Nav items (hidden on small screens, shown from md up). 
              Each link: text-sm (14px), font-medium, color=gray-100 (#F3F4F6), hover→white.
              Spaced 16px apart (space-x-4). 
            */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="#"
                className="
                  flex items-center
                  text-sm font-medium 
                  text-gray-100 
                  hover:text-white 
                  transition-colors
                "
              >
                <span>All Category</span>
                <FaChevronDown className="ml-1 text-xs text-gray-100" />
              </Link>

              <Link
                to="/bulk-order"
                className="
                  text-sm font-medium 
                  text-gray-100 
                  hover:text-white 
                  transition-colors
                "
              >
                Bulk Order
              </Link>

              <Link
                to="/credit-finance"
                className="
                  text-sm font-medium 
                  text-gray-100 
                  hover:text-white 
                  transition-colors
                "
              >
                Credit Finance
              </Link>
            </nav>
          </div>


          {/**=============================================== */}
          {/** 2) CENTER: Search Bar                        **/}
          {/**=============================================== */}
          <div className="flex-1 flex justify-end pr-6">
            <form onSubmit={handleSearch} className="w-full max-w-md flex justify-between items-center bg-white rounded-sm overflow-hidden shadow-md">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="text-sm flex-1 outline-none border-none px-4 py-2 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="px-4 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <SearchIcon />
              </button>
            </form>
          </div>


          {/**=============================================== */}
          {/** 3) RIGHT: Cart Icon + Login Button          **/}
          {/**=============================================== */}
          <div className="flex items-center space-x-4 mr-8">
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
          </div>

        </div>
      </div>
    </header>
  );
};

export default HeaderDG;
