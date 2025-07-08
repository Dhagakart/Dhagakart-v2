import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Collapse, 
  styled 
} from '@mui/material';
import { 
  Home as HomeIcon,
  Storefront as StorefrontIcon,
  ShoppingBasket as ShoppingBasketIcon,
  CreditCard as CreditCardIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
  ListAlt as ListAltIcon,
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
  LocalOffer as OfferIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

// Styled components for better organization
const StyledListItemButton = styled(ListItemButton)({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const StyledNestedListItem = styled(ListItemButton)({
  paddingLeft: '32px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const MobileNav = ({ 
  handleDrawerToggle, 
  isAuthenticated, 
  user, 
  setShowLogoutConfirm,
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openBulkOrder, setOpenBulkOrder] = useState(false);

  const handleProductsClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the drawer
    setOpenProducts(prev => !prev);
    if (openBulkOrder) setOpenBulkOrder(false);
  };

  const handleBulkOrderClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the drawer
    setOpenBulkOrder(prev => !prev);
    if (openProducts) setOpenProducts(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    handleDrawerToggle(); // Close the drawer
  }

  const onSearchSubmit = (e) => {
    handleSearch(e);
    handleDrawerToggle(); // Close the drawer on search
  }

  return (
    <Box
      sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      {isAuthenticated && user ? (
        <Box sx={{ p: 2, bgcolor: '#003366', color: 'white' }}>
          <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Hey, {user.name.split(' ')[0]}
        </Box>
      ) : (
        <Box sx={{ p: 2, bgcolor: '#003366', color: 'white' }}>
          DhagaKart
        </Box>
      )}
      <Divider />
      <Box sx={{ p: 2 }} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <form onSubmit={onSearchSubmit} className="flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 h-10 px-4 text-sm bg-gray-100 text-gray-800 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="h-10 w-10 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md flex items-center justify-center transition-colors"
            aria-label="Search"
          >
            <SearchIcon style={{ fontSize: '1.1rem' }} />
          </button>
        </form>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {/* Products Accordion */}
        <ListItem disablePadding onClick={(e) => e.stopPropagation()}>
          <StyledListItemButton onClick={handleProductsClick}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {openProducts ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>
        </ListItem>
        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <StyledNestedListItem component={Link} to="/products/silk%20yarn" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <OfferIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Silk Yarn" />
              </StyledNestedListItem>
            </ListItem>
            <ListItem disablePadding>
              <StyledNestedListItem component={Link} to="/products/cotton%20yarn" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <OfferIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Cotton Yarn" />
              </StyledNestedListItem>
            </ListItem>
            <ListItem disablePadding>
              <StyledNestedListItem component={Link} to="/products/polyster%20yarn" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <OfferIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Polyster Yarn" />
              </StyledNestedListItem>
            </ListItem>
          </List>
        </Collapse>

        {/* Bulk Order Accordion */}
        <ListItem disablePadding onClick={(e) => e.stopPropagation()}>
          <StyledListItemButton onClick={handleBulkOrderClick}>
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Bulk Order" />
            {openBulkOrder ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>
        </ListItem>
        <Collapse in={openBulkOrder} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem disablePadding>
              <StyledNestedListItem component={Link} to="/bulkorder" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Bulk Order Enquiry" />
              </StyledNestedListItem>
            </ListItem>
            <ListItem disablePadding>
              <StyledNestedListItem component={Link} to="/bulkorder/policy" onClick={handleDrawerToggle}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Bulk Order Policy" />
              </StyledNestedListItem>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/reqcredits">
            <ListItemIcon>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary="Credit Finance" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List sx={{ marginTop: 'auto' }}>
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/account">
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="My Account" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/account/orders">
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="My Orders" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogoutClick}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default MobileNav;