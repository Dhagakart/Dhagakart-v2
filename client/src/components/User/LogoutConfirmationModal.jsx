import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const LogoutConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/50" />
      <div className="relative bg-white rounded-xl p-6 w-96 shadow-lg z-10">
        <Typography variant="h6" component="h2" className="text-center mb-4 text-gray-800">
          Confirm Logout
        </Typography>
        <Typography variant="body1" className="text-center mb-6 text-gray-600">
          Are you sure you want to logout?
        </Typography>
        <Box className="flex justify-center gap-4">
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              color: '#003366',
              textTransform: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              border: '1px solid #003366',
              '&:hover': {
                backgroundColor: '#003366',
                color: 'white',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            sx={{
              backgroundColor: '#003366',
              color: 'white',
              textTransform: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              '&:hover': {
                backgroundColor: '#00264d',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
