import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { saveShippingInfo } from '../../actions/cartAction';
import { 
    addShippingAddress, 
    updateShippingAddress, 
    deleteShippingAddress,
    clearErrors 
} from '../../actions/userAction';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

const Shipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user, loading, error, isUpdated, isDeleted } = useSelector((state) => state.user);
    
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isNewAddress, setIsNewAddress] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        primaryAddress: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        phoneNumber: '',
        email: '',
        additionalInfo: '',
        isDefault: false
    });

    // Load user addresses
    useEffect(() => {
        console.log('useEffect - user changed:', { user });
        if (user) {
            console.log('Setting addresses from user:', user.shippingAddresses);
            setAddresses(user.shippingAddresses || []);
            
            if (user.shippingAddresses?.length > 0) {
                const defaultAddress = user.shippingAddresses.find(addr => addr.isDefault) || user.shippingAddresses[0];
                console.log('Setting default address:', defaultAddress);
                setSelectedAddress(defaultAddress._id);
                handleAddressSelect(defaultAddress);
            } else {
                console.log('No shipping addresses found');
            }
            setIsLoading(false);
        }
    }, [user]);

    // Handle success/error messages and state updates
    useEffect(() => {
        console.log('useEffect - state changes:', { error, isDeleted, isUpdated });
        if (error) {
            console.error('Error in Shipping component:', error);
            toast.error(error);
            dispatch(clearErrors());
        }
        
        if (isDeleted) {
            console.log('Address deleted successfully');
            toast.success('Address deleted successfully');
            dispatch({ type: 'DELETE_SHIPPING_ADDRESS_RESET' });
        }
        
        if (isUpdated) {
            console.log('Address update detected in useEffect');
            console.log('Current isEditing:', isEditing);
            console.log('Current isNewAddress:', isNewAddress);
            toast.success('Address updated successfully');
            dispatch({ type: 'UPDATE_SHIPPING_ADDRESS_RESET' });
            
            // Force close the form
            console.log('Forcing form to close');
            setIsEditing(false);
            setIsNewAddress(false);
        }
    }, [dispatch, error, isDeleted, isUpdated]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle address selection
    const handleAddressSelect = (address) => {
        setSelectedAddress(address._id);
        dispatch(saveShippingInfo({
            address: address.primaryAddress,
            city: address.city,
            state: address.state,
            pincode: address.zipCode,
            phoneNo: address.phoneNumber,
            country: address.country,
            email: address.email
        }));
    };

    // Add new shipping address
    const handleAddAddress = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
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
            isDefault: formData.isDefault || addresses.length === 0
        };
        
        try {
            const updatedUser = await dispatch(addShippingAddress(addressData));
            
            if (updatedUser) {
                toast.success('Address added successfully');
                
                // Update addresses list from user state
                const updatedAddresses = updatedUser.shippingAddresses || [];
                setAddresses(updatedAddresses);
                
                // Select the new address if it's set as default or no address was selected
                if (formData.isDefault || !selectedAddress) {
                    const newAddress = updatedAddresses[updatedAddresses.length - 1];
                    if (newAddress) {
                        setSelectedAddress(newAddress._id);
                        handleAddressSelect(newAddress);
                    }
                }
                
                // Close form and reset state
                setIsNewAddress(false);
                setIsEditing(false);
                setFormData({
                    fullName: '',
                    primaryAddress: '',
                    city: '',
                    state: '',
                    country: 'India',
                    zipCode: '',
                    phoneNumber: '',
                    email: '',
                    additionalInfo: '',
                    isDefault: false
                });
            }
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error(error.response?.data?.message || 'Failed to add address');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update shipping address
    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        console.log('handleUpdateAddress called with:', formData);
        setIsSubmitting(true);
        
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
            isDefault: formData.isDefault
        };
        
        try {
            console.log('Dispatching updateShippingAddress with:', { selectedAddress, addressData });
            const updatedUser = await dispatch(updateShippingAddress(selectedAddress, addressData));
            console.log('updateShippingAddress result:', updatedUser);
            
            if (updatedUser) {
                console.log('Update successful, updating local state');
                // Update addresses list from user state
                setAddresses(updatedUser.shippingAddresses || []);
                
                // Update selected address if it was the one edited
                if (selectedAddress) {
                    const updatedAddress = updatedUser.shippingAddresses.find(addr => addr._id === selectedAddress);
                    if (updatedAddress) {
                        console.log('Updated address found, selecting it');
                        handleAddressSelect(updatedAddress);
                    }
                }
                
                // Close form and reset state
                console.log('Closing form and resetting state');
                setIsEditing(false);
                setIsNewAddress(false);
                setFormData({
                    fullName: '',
                    primaryAddress: '',
                    city: '',
                    state: '',
                    country: 'India',
                    zipCode: '',
                    phoneNumber: '',
                    email: '',
                    additionalInfo: '',
                    isDefault: false
                });
                
                // Show success message
                toast.success('Address updated successfully');
                
                console.log('Form should be closed now');
            } else {
                console.warn('Update was not successful');
                toast.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
            toast.error(error.response?.data?.message || 'Failed to update address');
        } finally {
            setIsSubmitting(false);
        }
    };

    // State for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    // Open delete confirmation modal
    const confirmDeleteAddress = (id, e) => {
        e.stopPropagation();
        setAddressToDelete(id);
        setShowDeleteModal(true);
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAddressToDelete(null);
    };

    // Delete shipping address
    const handleDeleteAddress = async () => {
        if (!addressToDelete) return;
        
        try {
            console.log('Attempting to delete address:', addressToDelete);
            const result = await dispatch(deleteShippingAddress(addressToDelete));
            console.log('Delete result:', result);
            
            if (result && result.success) {
                // Update addresses list from the updated user data
                const updatedUser = result.user || user; // Fallback to current user data if not in result
                const updatedAddresses = updatedUser.shippingAddresses || [];
                
                setAddresses(updatedAddresses);
                
                // Update selected address if the deleted one was selected
                if (selectedAddress === addressToDelete) {
                    setSelectedAddress(null);
                    dispatch(saveShippingInfo({}));
                    
                    // Select the first available address if any
                    if (updatedAddresses.length > 0) {
                        const firstAddress = updatedAddresses[0];
                        setSelectedAddress(firstAddress._id);
                        handleAddressSelect(firstAddress);
                    }
                }
                
                // Show success message
                toast.success('Address deleted successfully');
                
                // Close the modal
                closeDeleteModal();
                
                // Reset form if in edit mode
                setIsEditing(false);
                setIsNewAddress(false);
            } else {
                console.error('Delete operation did not return success');
                toast.error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error in handleDeleteAddress:', error);
            toast.error(error.message || 'Failed to delete address');
            closeDeleteModal(); // Ensure modal is closed even on error
        }
    };

    // Proceed to payment
    const handleProceedToPayment = () => {
        if (!selectedAddress) {
            enqueueSnackbar('Please select an address', { variant: 'error' });
            return;
        }
        navigate('/process/payment');
    };

    // Calculate cart totals
    const calculateCartTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity), 0);
        const discount = cartItems.reduce((sum, item) => sum + ((item.cuttedPrice * item.quantity) - (item.price * item.quantity)), 0);
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * 0.1; // 10% tax
        const finalTotal = total + tax;
        return { subtotal, discount, total, tax, finalTotal };
    };

    const { subtotal, discount, total, tax, finalTotal } = calculateCartTotals();

    const PriceRow = ({ label, value, isDiscount = false, isTotal = false }) => (
        <div className={`flex justify-between ${isTotal ? 'pt-3 mt-3 border-t border-gray-200' : ''}`}>
            <span className={`${isTotal ? 'font-semibold' : 'text-gray-600'} ${isTotal ? 'text-lg' : 'text-base'}`}>
                {label}
            </span>
            <span className={`${isDiscount ? 'text-green-600' : 'font-medium'} ${isTotal ? 'text-lg font-semibold' : 'text-base'}`}>
                {value}
            </span>
        </div>
    );

    const CartItemCard = ({ item }) => (
        <div className="flex items-start gap-3 pb-3">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">
                        {item.quantity} × <span className="font-medium text-blue-800">{formatPrice(item.price)}</span>
                    </span>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
            </div>
        </div>
    );

    const renderPriceSidebar = () => (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">Order Summary</h2>
            <div className="space-y-4 pt-4">
                <PriceRow label="Sub-total" value={formatPrice(subtotal)} />
                <PriceRow label="Shipping" value="Free" isDiscount />
                <PriceRow label="Discount" value={`-${formatPrice(discount)}`} isDiscount />
                <PriceRow label="Tax (10%)" value={formatPrice(tax)} />
                <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
            </div>
            <button
                onClick={handleProceedToPayment}
                disabled={!selectedAddress}
                className={`w-full text-white py-3 rounded-md transition-colors duration-200 mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer ${
                    !selectedAddress
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#003366] hover:bg-[#003366]/99'
                }`}
            >
                Proceed to Payment
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[99vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <MetaData title="Shipping Details" />
            <div className="container mx-auto px-16 py-8 mt-10">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Address Selection */}
                    <div className="md:w-2/3">
                        {!isNewAddress && !isEditing ? (
                            <div className="p-8 rounded-lg shadow-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Select Address</h2>
                                    <button
                                        onClick={() => {
                                            setIsNewAddress(true);
                                            setFormData({
                                                fullName: '',
                                                companyName: '',
                                                primaryAddress: '',
                                                city: '',
                                                state: '',
                                                country: 'India',
                                                zipCode: '',
                                                phoneNumber: '',
                                                email: '',
                                                additionalInfo: '',
                                            });
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:cursor-pointer"
                                    >
                                        + Add New Address
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {addresses.length > 0 ? (
                                        addresses.map((address) => (
                                            <div 
                                                key={address._id}
                                                className={`border border-gray-200 rounded-lg p-4 flex items-start space-x-3 cursor-pointer transition-all duration-200 hover:border-blue-300 ${selectedAddress === address._id ? 'border-blue-300 bg-[#F2F4F5]' : 'bg-white'}`}
                                                onClick={() => handleAddressSelect(address)}
                                            >
                                                <div className="flex items-center h-5 mt-1">
                                                    <div className={`h-4 w-4 border-2 rounded-full flex items-center justify-center transition-colors duration-200 ${selectedAddress === address._id ? 'border-blue-500 bg-white' : 'border-gray-400'}`}>
                                                        {selectedAddress === address._id && (
                                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2">
                                                            <h3 className="font-semibold text-gray-600">{address.fullName}</h3>
                                                            <p className="text-gray-600 text-sm">{address.primaryAddress}, {address.city}, {address.state}, {address.country}, {address.zipCode}</p>
                                                            <p className="text-gray-600 text-sm">
                                                                <span className="uppercase font-semibold">Phone Number: </span>{address.phoneNumber}
                                                            </p>
                                                            {address.email && (
                                                                <p className="text-gray-600 text-sm">
                                                                    <span className="uppercase font-semibold">Email: </span>{address.email}
                                                                </p>
                                                            )}
                                                            {address.additionalInfo && (
                                                                <p className="text-gray-600 text-sm">
                                                                    <span className="uppercase font-semibold">Note: </span>{address.additionalInfo}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFormData({ ...address });
                                                                    setIsEditing(true);
                                                                }}
                                                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm hover:cursor-pointer"
                                                            >
                                                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5H3v-3.5L16.732 3.732z" />
                                                                </svg>
                                                                {isEditing && selectedAddress === address._id ? 'Editing...' : 'Edit'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => confirmDeleteAddress(address._id, e)}
                                                                className="text-red-600 hover:text-red-800 text-sm ml-2 hover:cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                            <div className="mb-4">
                                                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-700 mb-2">No Addresses Found</h4>
                                            <p className="text-gray-500 max-w-md">You haven't saved any addresses yet. Add your first address to get started with your order.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 rounded-lg shadow-lg border border-gray-200">
                                <h3 className="text-lg font-medium mb-4">
                                    {isEditing ? 'Edit Address Information' : 'Add Address Information'}
                                </h3>
                                <form onSubmit={isEditing ? handleUpdateAddress : handleAddAddress}>
                                    <div className="space-y-4">
                                        {/* Full Name and Company Name */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter here"
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    Company Name <span className="text-gray-500 font-normal lowercase text-xs">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter here"
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                name="primaryAddress"
                                                value={formData.primaryAddress}
                                                onChange={handleInputChange}
                                                placeholder="Enter here"
                                                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        {/* Country, State, City */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    Country
                                                </label>
                                                <select
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="India">India</option>
                                                    {/* Add more countries as needed */}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    State
                                                </label>
                                                <select
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                    <option value="Gujarat">Gujarat</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="West Bengal">West Bengal</option>
                                                    <option value="Haryana">Haryana</option>
                                                    <option value="Punjab">Punjab</option>
                                                    <option value="Rajasthan">Rajasthan</option>
                                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                                    <option value="Odisha">Odisha</option>
                                                    <option value="Jharkhand">Jharkhand</option>
                                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                    <option value="Uttarakhand">Uttarakhand</option>
                                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                    <option value="Manipur">Manipur</option>
                                                    <option value="Meghalaya">Meghalaya</option>
                                                    <option value="Mizoram">Mizoram</option>
                                                    <option value="Nagaland">Nagaland</option>
                                                    <option value="Sikkim">Sikkim</option>
                                                    <option value="Tripura">Tripura</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    City
                                                </label>
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Mumbai">Mumbai</option>
                                                    <option value="Pune">Pune</option>
                                                    <option value="Nashik">Nashik</option>
                                                    <option value="Nagpur">Nagpur</option>
                                                    <option value="Ahmedabad">Ahmedabad</option>
                                                    <option value="Surat">Surat</option>
                                                    <option value="Vadodara">Vadodara</option>
                                                    <option value="Indore">Indore</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Zip Code, Phone Number, Email ID */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    Zip Code
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter here"
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter here"
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                    Email ID
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter here"
                                                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Additional Information Section */}
                                        <div className="mt-6">
                                            <label className="block text-sm font-bold uppercase text-gray-700 mb-1">
                                                Order Notes <span className="text-gray-500 font-normal lowercase text-xs">(Optional)</span>
                                            </label>
                                            <textarea
                                                name="additionalInfo"
                                                value={formData.additionalInfo}
                                                onChange={handleInputChange}
                                                placeholder="Notes about the order, e.g. special notes for delivery"
                                                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                                rows="4"
                                            ></textarea>
                                        </div>

                                    </div>

                                    {/* Form Buttons */}
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsNewAddress(false);
                                                setIsEditing(false);
                                                setFormData({
                                                    fullName: '',
                                                    companyName: '',
                                                    primaryAddress: '',
                                                    city: '',
                                                    state: '',
                                                    country: 'India',
                                                    zipCode: '',
                                                    phoneNumber: '',
                                                    email: '',
                                                    additionalInfo: '',
                                                });
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 hover:cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-48 hover:cursor-pointer bg-[#003366] text-white py-2 px-4 rounded-md hover:bg-[#00264d] transition-colors duration-200 flex items-center justify-center ${isSubmitting ? 'opacity-75' : ''}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {isEditing ? 'Updating...' : 'Saving...'}
                                                </>
                                            ) : (
                                                isEditing ? 'Update Address' : 'Save Address'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                    
                    {/* Price Sidebar */}
                    <div className="md:w-1/3">
                        {renderPriceSidebar()}
                    </div>
                </div>
                
                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Address</h3>
                            <p className="text-gray-700 mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAddress}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Shipping;