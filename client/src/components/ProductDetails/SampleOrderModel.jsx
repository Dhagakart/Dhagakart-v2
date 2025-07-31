// src/components/Product/SampleOrderModal.js

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// Make sure you are importing the CORRECT action
import { addItemsToSampleCart } from '../../actions/cartAction';

// MUI Imports
import { Modal, Box, Typography, IconButton, Button, Backdrop } from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #ddd',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
  outline: 'none',
};

const SampleOrderModal = ({ open, onClose, product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const MAX_SAMPLE_QTY = 5;

  useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open]);

  if (!product) return null;

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, MAX_SAMPLE_QTY));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  // This is the critical function. Ensure it's correct.
  const handleAddSampleToCart = () => {
    // 1. Dispatch the SPECIFIC action for the sample cart.
    dispatch(addItemsToSampleCart(product._id, quantity));
    
    // 2. Redirect to the sample cart page.
    navigate('/sample-cart'); 
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sample-order-modal-title"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(0,0,30,0.4)',
          },
        },
      }}
    >
      <Box sx={style}>
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>

        <Typography id="sample-order-modal-title" variant="h6" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
          Order Product Sample
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
          <Box component="img" sx={{ height: 80, width: 80, objectFit: 'contain', borderRadius: '8px', border: '1px solid #eee' }} alt={product.name} src={product.images?.[0]?.url || ''} />
          <Typography variant="body1" sx={{ fontWeight: '500' }}>{product.name}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Select Quantity:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
            <IconButton onClick={handleDecrement} disabled={quantity <= 1}><RemoveIcon /></IconButton>
            <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
            <IconButton onClick={handleIncrement} disabled={quantity >= MAX_SAMPLE_QTY}><AddIcon /></IconButton>
          </Box>
        </Box>
        
        <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
          A maximum of {MAX_SAMPLE_QTY} samples can be ordered.
        </Typography>

        <Button fullWidth variant="contained" size="large" onClick={handleAddSampleToCart} sx={{ py: 1.5, backgroundColor: '#003366', '&:hover': { backgroundColor: '#002244' } }}>
          Add to Sample Cart
        </Button>
      </Box>
    </Modal>
  );
};

export default SampleOrderModal;