import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Modal, Backdrop, Fade, Box, TextField, Button, IconButton, Typography,
    FormControlLabel, Checkbox, InputLabel, MenuItem, Select, FormControl, Grid, Paper, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { X, MapPin } from 'lucide-react'; // Changed icon to MapPin

const ModalContent = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3),
    borderRadius: '12px',
    outline: 'none',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
}));

const ShippingModal = ({ 
    open, 
    onClose, 
    onSubmit, 
    shippingDetails, // Prop name changed to shippingDetails
    user,
    shippingAddresses = [] // Prop name changed to shippingAddresses
}) => {
    // Hardcoded list of Indian states
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
        'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
        'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];
    
    // Helper function to get a clean, default state object
    const getInitialFormData = () => ({
        fullName: '',
        primaryAddress: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        phoneNumber: '',
        email: user?.email || '',
        additionalInfo: '',
        isDefault: shippingAddresses?.length === 0,
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This hook syncs the form state with props every time the modal is opened.
    useEffect(() => {
        if (open) {
            if (shippingDetails) {
                setFormData({ ...getInitialFormData(), ...shippingDetails });
            } else {
                setFormData(getInitialFormData());
            }
        }
    }, [open, shippingDetails, user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requiredFields = ['fullName', 'primaryAddress', 'city', 'state', 'zipCode', 'phoneNumber', 'email'];
        const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(e, formData);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Failed to save address.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
            <Fade in={open}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <ModalContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MapPin /> Shipping Information
                            </Typography>
                            <IconButton onClick={onClose}><X /></IconButton>
                        </Box>
                        
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}><TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required /></Grid>
                                <Grid item xs={12}><TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required /></Grid>
                                <Grid item xs={12}><TextField fullWidth label="Phone Number" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required /></Grid>
                                <Grid item xs={12}><Divider sx={{ my: 1 }}>Address</Divider></Grid>
                                <Grid item xs={12}><TextField fullWidth label="Primary Address" name="primaryAddress" value={formData.primaryAddress} onChange={handleInputChange} required multiline rows={2} /></Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required><InputLabel>State</InputLabel><Select name="state" value={formData.state} onChange={handleInputChange} label="State">{indianStates.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}</Select></FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="City" name="city" value={formData.city} onChange={handleInputChange} required /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="ZIP / Postal Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Country" name="country" value={formData.country} disabled /></Grid>
                                <Grid item xs={12}><FormControlLabel control={<Checkbox checked={formData.isDefault} onChange={handleInputChange} name="isDefault" />} label="Set as default shipping address" /></Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Address'}</Button>
                            </Box>
                        </form>
                    </ModalContent>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ShippingModal;