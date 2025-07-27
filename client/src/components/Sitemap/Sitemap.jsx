import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';

const Sitemap = () => {
  const routes = [
    // Public Routes
    { path: '/', name: 'Home' },
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/register/success', name: 'Registration Success' },
    { path: '/loginDG', name: 'DG Login' },
    { path: '/otpDG', name: 'OTP Verification' },
    { path: '/loginDG2', name: 'DG Login 2' },
    { path: '/password/forgot', name: 'Forgot Password' },
    { path: '/password/reset/:token', name: 'Reset Password' },
    { path: '/product/:id', name: 'Product Details' },
    { path: '/products', name: 'All Products' },
    { path: '/products/:keyword', name: 'Search Products' },
    { path: '/cart', name: 'Shopping Cart' },
    { path: '/reqcredits', name: 'Request Credits' },
    { path: '/bulkorder', name: 'Bulk Order' },
    { path: '/quote/success', name: 'Quote Request Success' },
    
    // Protected Routes
    { path: '/shipping', name: 'Shipping', protected: true },
    { path: '/order/confirm', name: 'Order Confirmation', protected: true },
    { path: '/process/payment', name: 'Payment', protected: true },
    { path: '/orders/success', name: 'Order Success', protected: true },
    { path: '/orders/failed', name: 'Order Failed', protected: true },
    { path: '/order/:id', name: 'Order Status', protected: true },
    { path: '/orders', name: 'My Orders', protected: true },
    { path: '/order_details/:id', name: 'Order Details', protected: true },
    { path: '/account', name: 'My Account', protected: true },
    { path: '/account/update', name: 'Update Profile', protected: true },
    { path: '/password/update', name: 'Update Password', protected: true },
    { path: '/wishlist', name: 'My Wishlist', protected: true },
    
    // Admin Routes
    { path: '/admin/dashboard', name: 'Admin Dashboard', admin: true },
    { path: '/admin/orders', name: 'Manage Orders', admin: true },
    { path: '/admin/order/:id', name: 'Update Order', admin: true },
    { path: '/admin/products', name: 'Manage Products', admin: true },
    { path: '/admin/new_product', name: 'Add New Product', admin: true },
    { path: '/admin/product/:id', name: 'Update Product', admin: true },
    { path: '/admin/users', name: 'Manage Users', admin: true },
    { path: '/admin/user/:id', name: 'Update User', admin: true },
    { path: '/admin/reviews', name: 'Manage Reviews', admin: true },
    { path: '/admin/quotes', name: 'Manage Quotes', admin: true },
  ];

  const publicRoutes = routes.filter(route => !route.protected && !route.admin);
  const protectedRoutes = routes.filter(route => route.protected);
  const adminRoutes = routes.filter(route => route.admin);

  const renderRouteList = (routes, title) => (
    <Paper elevation={2} style={{ marginBottom: '2rem', padding: '1rem' }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <List>
        {routes.map((route, index) => (
          <React.Fragment key={route.path}>
            <ListItem button component={Link} to={route.path}>
              <ListItemText 
                primary={route.name} 
                secondary={route.path} 
                primaryTypographyProps={{ style: { fontWeight: 500 } }}
              />
            </ListItem>
            {index < routes.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <Typography variant="h3" gutterBottom style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Website Sitemap
      </Typography>
      
      {renderRouteList(publicRoutes, 'Public Pages')}
      {renderRouteList(protectedRoutes, 'User Account Pages (Requires Login)')}
      {renderRouteList(adminRoutes, 'Admin Dashboard (Requires Admin Access)')}
      
      <Typography variant="body2" color="textSecondary" style={{ marginTop: '2rem', textAlign: 'center' }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>
    </Container>
  );
};

export default Sitemap;
