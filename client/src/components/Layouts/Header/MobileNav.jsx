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
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
  LocalOffer as OfferIcon,
  Settings as SettingsIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import Logo from './logo.png';
import { categories } from '../../../utils/constants';

// Styled components for better organization
// const StyledListItemButton = styled(ListItemButton)({
//   '&.Mui-selected': {
//     backgroundColor: '#003366',
//     color: 'white',
//     '&:hover': {
//       backgroundColor: '#00264d',
//     },
//   },
// });

const StyledNestedListItem = styled(ListItemButton)({
  padding: '8px 16px',
  '&.Mui-selected': {
    backgroundColor: '#f5f5f5',
    // '&:hover': {
    //   backgroundColor: '#e0e0e0',
    // },
  },
  // Remove hover effect
  '&:hover': {
    backgroundColor: 'inherit',
  },
});

// Styled components for better organization
const StyledListItemButton = styled(ListItemButton)({
  // Remove hover effect
  '&:hover': {
    backgroundColor: 'inherit',
  },
});

// const StyledNestedListItem = styled(ListItemButton)({
//   paddingLeft: '32px',
//   '&:hover': {
//     backgroundColor: 'rgba(0, 0, 0, 0.04)',
//   },
// });

const MobileNav = ({ 
  handleDrawerToggle, 
  isAuthenticated, 
  user, 
  setShowLogoutConfirm,
}) => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openBulkOrder, setOpenBulkOrder] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

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

  const handleCategoryClick = (catName) => {
    setOpenCategory(catName === openCategory ? null : catName);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    handleDrawerToggle(); // Close the drawer
  };

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: '100vw', md: 250 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        overflowY: 'auto',
      }}
      role="presentation"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleDrawerToggle}
    >
      {isAuthenticated && user ? (
        <Box sx={{ p: 2, bgcolor: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Hey, {user.name.split(' ')[0]}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <button onClick={handleDrawerToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }} aria-label="Close Menu">
              <CloseIcon sx={{ fontSize: 28 }} />
            </button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2, bgcolor: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={Logo} className='h-6 w-auto' />
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <button onClick={handleDrawerToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }} aria-label="Close Menu">
              <CloseIcon sx={{ fontSize: 28 }} />
            </button>
          </Box>
        </Box>
      )}
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/account" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItemButton>
          </ListItem>
        )}
        {/* Products Accordion */}
        <ListItem disablePadding onClick={(e) => e.stopPropagation()}>
          <StyledListItemButton onClick={handleProductsClick} disableRipple disableTouchRipple>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {openProducts ? <ExpandLess /> : <ExpandMore />}
          </StyledListItemButton>
        </ListItem>
        <Collapse in={openProducts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categories.map((cat, idx) => (
              <React.Fragment key={cat.name}>
                <ListItem disablePadding>
                  <StyledNestedListItem
                    onClick={() => handleCategoryClick(cat.name)}
                    selected={openCategory === cat.name}
                  >
                    <ListItemText primary={cat.name} primaryTypographyProps={{ fontWeight: 600 }} />
                    {openCategory === cat.name ? <ExpandLess /> : <ExpandMore />}
                  </StyledNestedListItem>
                </ListItem>
                <Collapse in={openCategory === cat.name} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {cat.subcategories.map((sub, subIdx) => (
                      <ListItem disablePadding key={sub}>
                        <StyledNestedListItem
                          component={Link}
                          
                          to={
                            sub.toLowerCase() === 'sewing machine' ? '/products/jack' :
                            sub.toLowerCase() === 'powerloom' ? '/products/power%20loom' :
                            `/products/${encodeURIComponent(sub.toLowerCase().replace(/ /g, '%20'))}` 
                          }
                          onClick={handleDrawerToggle}
                          selected={window.location.pathname === `/products/${encodeURIComponent(sub.toLowerCase().replace(/ /g, '%20'))}`}
                        >
                          <ListItemIcon>
                            <OfferIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={sub} />
                        </StyledNestedListItem>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Collapse>

        {/* Bulk Order Accordion */}
        <ListItem disablePadding onClick={(e) => e.stopPropagation()}>
          <StyledListItemButton onClick={handleBulkOrderClick} disableRipple disableTouchRipple>
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
          <ListItemButton component={Link} to="/reqcredits" onClick={handleDrawerToggle}>
            <ListItemIcon>
              <CreditCardIcon />
            </ListItemIcon>
            <ListItemText primary="Credit Finance" />
          </ListItemButton>
        </ListItem>
        
        {/* Mobile-only Auth Section */}
        <Divider />
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogoutClick}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      {/* Removed bottom Logout button */}
    </Box>
  );
};

export default MobileNav;