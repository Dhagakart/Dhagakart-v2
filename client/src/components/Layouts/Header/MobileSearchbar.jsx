import React from 'react';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const MobileSearchBar = ({ searchQuery, setSearchQuery, handleSearch, isNavbarHidden }) => {
  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'none' },
        bgcolor: '#003366',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        px: 2,
        py: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1200,
        transform: isNavbarHidden ? 'translateY(0)' : 'translateY(64px)',
        transition: 'transform 200ms ease-in-out',
        willChange: 'transform',
      }}
    >
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
    </Box>
  );
};

export default MobileSearchBar;