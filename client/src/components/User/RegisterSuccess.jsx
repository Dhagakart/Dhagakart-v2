import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const RegisterSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '91vh',
        textAlign: 'center',
        p: 6,
      }}
    >
      <CheckCircleOutlineIcon
        color="success"
        sx={{ fontSize: 80, mb: 3, color: '#4caf50' }}
      />
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Registration Successful!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Thank you for registering. You'll be redirected to the home page shortly.
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={20} sx={{ mr: 1, color: '#4caf50' }} />
        <Typography variant="body2" color="text.secondary">
          Redirecting...
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterSuccess;
