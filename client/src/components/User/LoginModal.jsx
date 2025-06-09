import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Box, Typography, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GoogleIcon from '../../assets/images/googleLogo.png';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', { email, password });
    onClose();
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Google login clicked');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="flex rounded-xl sm:w-4/6 sm:mt-6 m-auto mb-7 bg-white shadow-lg">
        {/* Left Side - Blue Background */}
        <Grid item xs={12} md={5} sx={{ 
          background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)', 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          borderRadius: '8px 0 0 8px' 
        }}>
          <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
            Sign in to continue your shopping experience
          </Typography>
          <Box>
            {['Secure Business Account', 'Premium Textile Selection', 'Dedicated Account Manager', '24/7 Business Support'].map((t, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: 'warning.main' }} />
                <Typography sx={{ color: 'white' }}>{t}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-tr-xl rounded-br-xl p-6 md:p-8 lg:p-12 md:w-1/2 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <TextField
                  fullWidth
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderRadius: '8px',
                      },
                    },
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <TextField
                  fullWidth
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderRadius: '8px',
                      },
                    },
                  }}
                  required
                />
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#003366',
                  color: 'white',
                  textTransform: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  '&:hover': {
                    backgroundColor: '#00264d',
                  },
                }}
              >
                Continue
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  color: '#003366',
                  textTransform: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #003366',
                  '&:hover': {
                    backgroundColor: '#003366',
                    color: 'white',
                  },
                }}
                onClick={handleGoogleLogin}
              >
                <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2 inline" />
                Continue with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
