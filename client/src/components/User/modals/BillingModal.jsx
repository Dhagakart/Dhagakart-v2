// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';
// import {
//     Modal,
//     Backdrop,
//     Fade,
//     Box,
//     TextField,
//     Button,
//     IconButton,
//     Typography,
//     FormControlLabel,
//     Checkbox,
//     InputAdornment,
//     InputLabel,
//     MenuItem,
//     Select,
//     FormControl,
//     Divider,
//     Paper,
//     Grid
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { X, User, MapPin, Phone, Mail, FileText, CreditCard, ChevronDown } from 'lucide-react';
// import statesData from '../../../utils/states';

// const ModalContent = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(3),
//     borderRadius: '12px',
//     outline: 'none',
//     maxWidth: '500px',
//     width: '90%',
//     maxHeight: '90vh',
//     overflowY: 'auto',
//     '&:focus': {
//         outline: 'none',
//     },
//     [theme.breakpoints.up('sm')]: {
//         padding: theme.spacing(4),
//     },
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//     marginBottom: theme.spacing(2),
//     '& .MuiOutlinedInput-root': {
//         borderRadius: '8px',
//         '& fieldset': {
//             borderColor: theme.palette.grey[300],
//         },
//         '&:hover fieldset': {
//             borderColor: theme.palette.primary.main,
//         },
//         '&.Mui-focused fieldset': {
//             borderWidth: '1px',
//             borderColor: theme.palette.primary.main,
//         },
//     },
// }));

// const StyledSelect = styled(Select)(({ theme }) => ({
//     marginBottom: theme.spacing(2),
//     '& .MuiOutlinedInput-root': {
//         borderRadius: '8px',
//         '& fieldset': {
//             borderColor: theme.palette.grey[300],
//         },
//         '&:hover fieldset': {
//             borderColor: theme.palette.primary.main,
//         },
//         '&.Mui-focused fieldset': {
//             borderWidth: '1px',
//             borderColor: theme.palette.primary.main,
//         },
//     },
// }));

// const BillingModal = ({ 
//     open, 
//     onClose, 
//     onSubmit, 
//     billingDetails = {}, 
//     setBillingDetails,
//     user,
//     billingAddresses = []
// }) => {
//     // Indian states for the dropdown
//     const indianStates = [
//         'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
//         'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
//         'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
//         'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
//         'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
//         'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
//         'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
//         'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
//     ];

//     // Form state with default values matching the backend schema
//     const [formData, setFormData] = useState({
//         fullName: '',
//         primaryAddress: '',
//         city: '',
//         state: '',
//         country: 'India',
//         zipCode: '',
//         phoneNumber: '',
//         email: user?.email || '',
//         additionalInfo: '',
//         isDefault: billingAddresses?.length === 0 || false,
//         ...billingDetails
//     });

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const dispatch = useDispatch();
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Check required fields
//         const requiredFields = ['fullName', 'primaryAddress', 'city', 'state', 'zipCode', 'phoneNumber'];
//         const missingFields = requiredFields.filter(field => !formData[field]?.trim());

//         if (missingFields.length > 0) {
//             toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             // Prepare address data
//             const addressData = {
//                 fullName: formData.fullName.trim(),
//                 primaryAddress: formData.primaryAddress.trim(),
//                 city: formData.city.trim(),
//                 state: formData.state,
//                 country: formData.country || 'India',
//                 zipCode: formData.zipCode.trim(),
//                 phoneNumber: formData.phoneNumber.trim(),
//                 email: (formData.email || user?.email || '').trim(),
//                 additionalInfo: (formData.additionalInfo || '').trim(),
//                 isDefault: !!formData.isDefault
//             };

//             const submitData = {
//                 fullName: addressData.fullName,
//                 primaryAddress: addressData.primaryAddress,
//                 city: addressData.city,
//                 state: addressData.state,
//                 country: addressData.country || 'India',
//                 zipCode: addressData.zipCode,
//                 phoneNumber: addressData.phoneNumber,
//                 email: addressData.email,
//                 additionalInfo: addressData.additionalInfo,
//                 isDefault: addressData.isDefault || false
//             };

//             // Call the parent's onSubmit with the form data
//             await onSubmit(e, submitData);

//             // Show success message
//             toast.success(
//                 billingDetails?._id 
//                     ? 'Billing address updated successfully' 
//                     : 'Billing address added successfully'
//             );

//             // Close the modal
//             onClose();

//         } catch (error) {
//             console.error('Error submitting form:', error);
//             toast.error(
//                 error.response?.data?.message || 
//                 error.message || 
//                 'Failed to save billing address. Please try again.'
//             );
//             throw error; // Re-throw to allow parent to handle if needed
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Modal
//             open={open}
//             onClose={onClose}
//             closeAfterTransition
//             BackdropComponent={Backdrop}
//             BackdropProps={{ timeout: 300 }}
//         >
//             <Fade in={open}>
//                 <Box sx={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: '90%',
//                     maxWidth: '600px',
//                     maxHeight: '90vh',
//                     bgcolor: 'background.paper',
//                     boxShadow: 24,
//                     borderRadius: '8px',
//                     overflow: 'hidden',
//                     display: 'flex',
//                     flexDirection: 'column'
//                 }}>
//                     {/* Header */}
//                     <Box sx={{
//                         p: 2,
//                         backgroundColor: 'primary.main',
//                         color: 'white',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                     }}>
//                         <Typography variant="h6">
//                             <Box display="flex" alignItems="center" gap={1}>
//                                 <CreditCard size={20} />
//                                 <span>Billing Information</span>
//                             </Box>
//                         </Typography>
//                         <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
//                             <X size={20} />
//                         </IconButton>
//                     </Box>

//                     {/* Form */}
//                     <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
//                         <form onSubmit={handleSubmit}>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         label="Full Name"
//                                         name="fullName"
//                                         value={formData.fullName}
//                                         onChange={handleInputChange}
//                                         required
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         label="Email Address"
//                                         name="email"
//                                         type="email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         required
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         label="Phone Number"
//                                         name="phoneNumber"
//                                         type="tel"
//                                         value={formData.phoneNumber}
//                                         onChange={handleInputChange}
//                                         required
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <Divider sx={{ my: 2 }}>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Billing Address
//                                         </Typography>
//                                     </Divider>
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         label="Primary Address"
//                                         name="primaryAddress"
//                                         value={formData.primaryAddress}
//                                         onChange={handleInputChange}
//                                         required
//                                         multiline
//                                         rows={2}
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <FormControl fullWidth size="small" margin="normal">
//                                         <InputLabel>State</InputLabel>
//                                         <Select
//                                             name="state"
//                                             value={formData.state}
//                                             onChange={handleInputChange}
//                                             label="State"
//                                             required
//                                         >
//                                             <MenuItem value="" disabled>Select State</MenuItem>
//                                             {indianStates.map((state) => (
//                                                 <MenuItem key={state} value={state}>
//                                                     {state}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <TextField
//                                         fullWidth
//                                         label="City"
//                                         name="city"
//                                         value={formData.city}
//                                         onChange={handleInputChange}
//                                         required
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <TextField
//                                         fullWidth
//                                         label="ZIP / Postal Code"
//                                         name="zipCode"
//                                         value={formData.zipCode}
//                                         onChange={handleInputChange}
//                                         required
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12} sm={6}>
//                                     <TextField
//                                         fullWidth
//                                         label="Country"
//                                         name="country"
//                                         value="India"
//                                         disabled
//                                         size="small"
//                                         margin="normal"
//                                     />
//                                 </Grid>
//                                 <Grid item xs={12}>
//                                     <FormControlLabel
//                                         control={
//                                             <Checkbox 
//                                                 checked={formData.isDefault}
//                                                 onChange={handleInputChange}
//                                                 name="isDefault"
//                                             />
//                                         }
//                                         label="Set as default billing address"
//                                     />
//                                 </Grid>
//                             </Grid>
//                             <Box sx={{ 
//                                 display: 'flex', 
//                                 justifyContent: 'flex-end',
//                                 gap: 2,
//                                 mt: 3,
//                                 pt: 2,
//                                 borderTop: '1px solid',
//                                 borderColor: 'divider'
//                             }}>
//                                 <Button
//                                     variant="outlined"
//                                     onClick={onClose}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     type="submit"
//                                     variant="contained"
//                                     color="primary"
//                                 >
//                                     Save & Continue
//                                 </Button>
//                             </Box>
//                         </form>
//                     </Box>
//                 </Box>
//             </Fade>
//         </Modal>
//     );
// };

// export default BillingModal;

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Modal, Backdrop, Fade, Box, TextField, Button, IconButton, Typography,
    FormControlLabel, Checkbox, InputLabel, MenuItem, Select, FormControl, Grid, Paper, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { X, CreditCard } from 'lucide-react';

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

const BillingModal = ({
    open,
    onClose,
    onSubmit,
    billingDetails, // This can be null when adding
    user,
    billingAddresses = []
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
        isDefault: billingAddresses?.length === 0,
    });

    const [formData, setFormData] = useState(getInitialFormData());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This hook syncs the form state with props every time the modal is opened.
    // This fixes the crash and prevents stale data from appearing.
    useEffect(() => {
        if (open) {
            if (billingDetails) {
                // If editing, populate the form with existing address details.
                setFormData({ ...getInitialFormData(), ...billingDetails });
            } else {
                // If adding, reset the form to its initial clean state.
                setFormData(getInitialFormData());
            }
        }
    }, [open, billingDetails, user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // Inside BillingModal.jsx
    const handleSubmit = async (e) => {
        e.preventDefault(); // This is still needed to prevent the browser from reloading

        // --- Your validation logic here ---
        const requiredFields = ['fullName', 'primaryAddress', 'city', 'state', 'zipCode', 'phoneNumber', 'email'];
        const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());

        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. **Define the `addressData` object** from your form's state.
            //    This object should contain only the clean data for the API.
            const addressData = {
                fullName: formData.fullName,
                primaryAddress: formData.primaryAddress,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipCode: formData.zipCode,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                additionalInfo: formData.additionalInfo,
                isDefault: formData.isDefault,
            };

            // 2. Pass ONLY the newly created `addressData` object to the parent.
            await onSubmit(addressData);

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
                                <CreditCard /> Billing Information
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
                                <Grid item xs={12}><FormControlLabel control={<Checkbox checked={formData.isDefault} onChange={handleInputChange} name="isDefault" />} label="Set as default billing address" /></Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 2, borderTop: 1, borderColor: 'black' }}>
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

export default BillingModal;