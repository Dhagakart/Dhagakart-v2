import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreditApplicationModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    creditLimit: '',
    gstNumber: '',
    gstin: '',
    fullName: '',
    businessName: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
          maxWidth: 500
        }
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          General Information
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Typography color="text.secondary" variant="body2" mb={3} textAlign="center">
          Share your details so we can process your credit request.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { mb: 2 } }}>
          <FormControl fullWidth>
            <InputLabel id="credit-limit-label">Select your limit in Lacs*</InputLabel>
            <Select
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              label="Select your limit in Lacs*"
              required
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: 2,
                  borderColor: '#e0e0e0'
                }
              }}
            >
              <MenuItem value="10">10 Lacs</MenuItem>
              <MenuItem value="20">20 Lacs</MenuItem>
              <MenuItem value="30">30 Lacs</MenuItem>
              <MenuItem value="50">50 Lacs</MenuItem>
              <MenuItem value="100">1 Crore</MenuItem>
              <MenuItem value="200">2 Crore</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="GST No."
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="22AAAAA0000A1Z5"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Your GSTIN"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Name*"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0'
                }
              }
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0'
                }
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 0, pt: 2, mt: 2, borderTop: '1px solid #f0f0f0' }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: '#003087',
            '&:hover': {
              backgroundColor: '#002366',
            }
          }}
        >
          APPLY FOR CREDIT
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditApplicationModal;