import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItemsToSampleCart } from '../../actions/cartAction';
import { formatPrice } from '../../utils/formatPrice'; // Assuming you have this utility

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

  // --- MODIFICATION: Get max quantity and price from product.sampleConfig ---
  const maxSampleQuantity = product?.sampleConfig?.maxQuantity || 1;
  const samplePrice = product?.sampleConfig?.price || 0;

  useEffect(() => {
    if (open) {
      setQuantity(1); // Reset quantity to 1 each time the modal opens
    }
  }, [open]);

  if (!product) return null;

  const handleIncrement = () => {
    // Use the dynamic max quantity
    setQuantity((prev) => Math.min(prev + 1, maxSampleQuantity));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddSampleToCart = async () => {
    try {
      await dispatch(addItemsToSampleCart(product._id, quantity));
      navigate('/sample-cart');
    } catch (error) {
      // Show error notification to the user
      enqueueSnackbar(error.message || 'Failed to add item to sample cart', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      console.error('Error adding to sample cart:', error);
    }
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
          <Box>
            <Typography variant="body1" sx={{ fontWeight: '500' }}>{product.name}</Typography>
            {/* --- MODIFICATION: Display the sample price --- */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formatPrice(samplePrice)}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Select Quantity:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
            <IconButton onClick={handleDecrement} disabled={quantity <= 1}><RemoveIcon /></IconButton>
            <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
            {/* --- MODIFICATION: Use dynamic max quantity --- */}
            <IconButton onClick={handleIncrement} disabled={quantity >= maxSampleQuantity}><AddIcon /></IconButton>
          </Box>
        </Box>
        
        <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
          A maximum of {maxSampleQuantity} sample(s) can be ordered.
        </Typography>

        <Button fullWidth variant="contained" size="large" onClick={handleAddSampleToCart} sx={{ py: 1.5, backgroundColor: '#003366', '&:hover': { backgroundColor: '#002244' } }}>
          Add to Sample Cart
        </Button>
      </Box>
    </Modal>
  );
};

export default SampleOrderModal;
