import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // --- MODIFICATION: Imported react-hot-toast ---
import { addItemsToSampleCart } from '../../actions/cartAction';
import { formatPrice } from '../../utils/formatPrice';

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
  // --- MODIFICATION: Removed useSnackbar ---
  const [quantity, setQuantity] = useState(1);

  const maxSampleQuantity = product?.sampleConfig?.maxQuantity || 1;
  const samplePrice = product?.sampleConfig?.price || 0;

  useEffect(() => {
    if (open) {
      setQuantity(1); // Reset quantity to 1 each time the modal opens
    }
  }, [open]);

  if (!product) return null;

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, maxSampleQuantity));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddSampleToCart = async () => {
    try {
      await dispatch(addItemsToSampleCart(product._id, quantity));
      // --- MODIFICATION: Use toast.success for success notification ---
      toast.success(`${quantity} Sample(s) added to cart!`);
      navigate('/sample-cart');
    } catch (error) {
      // --- MODIFICATION: Use toast.error for error notification ---
      toast.error(error.message || 'Failed to add item to sample cart');
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{formatPrice(samplePrice)}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Select Quantity:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
            <IconButton onClick={handleDecrement} disabled={quantity <= 1}><RemoveIcon /></IconButton>
            <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
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
