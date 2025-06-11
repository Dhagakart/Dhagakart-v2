import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { saveShippingInfo } from '../../actions/cartAction';
import { useNavigate, useLocation } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import api from '../../utils/api';
import { formatPrice } from '../../utils/formatPrice';

const Shipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // API functions
    const getAddresses = () => api.get('/users/me');
    const addAddress = (address) => api.post('/users/me/address/add', address);
    const updateAddress = (id, address) => api.put(`/users/me/address/${id}`, address);
    const deleteAddress = (id) => api.delete(`/users/me/address/${id}`);

    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isNewAddress, setIsNewAddress] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        primaryAddress: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        phoneNumber: '',
        email: '',
        additionalInfo: ''
    });

    // Load user addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const { data } = await getAddresses();
                setAddresses(data.user.addresses || []);
                
                if (data.user.addresses?.length > 0) {
                    const defaultAddress = data.user.addresses.find(addr => addr.isDefault) || data.user.addresses[0];
                    setSelectedAddress(defaultAddress._id);
                    handleAddressSelect(defaultAddress);
                }
            } catch (error) {
                enqueueSnackbar('Failed to load addresses', { variant: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddresses();
    }, []);

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
            country: address.country
        }));
    };

    // Add new address
    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            console.log('Sending address data:', formData);
            const { data } = await addAddress(formData);
            console.log('Response:', data);
            const newAddress = data.user.addresses[data.user.addresses.length - 1];
            setAddresses([...addresses, newAddress]);
            enqueueSnackbar('Address added successfully', { variant: 'success' });
            
            if (formData.isDefault) {
                setSelectedAddress(newAddress._id);
                handleAddressSelect(newAddress);
            }
            
            setIsNewAddress(false);
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
                isDefault: addresses.length === 0
            });
        } catch (error) {
            console.error('Error adding address:', error);
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to add address', 
                { variant: 'error' }
            );
        }
    };

    // Update address
    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        try {
            await updateAddress(selectedAddress, formData);
            const { data } = await getAddresses();
            setAddresses(data.user.addresses || []);
            enqueueSnackbar('Address updated successfully', { variant: 'success' });
            
            if (selectedAddress === formData._id) {
                handleAddressSelect(formData);
            }
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating address:', error);
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to update address', 
                { variant: 'error' }
            );
        }
    };

    // Delete address
    const handleDeleteAddress = async (id) => {
        try {
            await deleteAddress(id);
            const updatedAddresses = addresses.filter(addr => addr._id !== id);
            setAddresses(updatedAddresses);
            enqueueSnackbar('Address deleted successfully', { variant: 'success' });
            
            if (selectedAddress === id) {
                setSelectedAddress(null);
                dispatch(saveShippingInfo({}));
                
                if (updatedAddresses.length > 0) {
                    const firstAddress = updatedAddresses[0];
                    setSelectedAddress(firstAddress._id);
                    handleAddressSelect(firstAddress);
                }
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to delete address', 
                { variant: 'error' }
            );
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
        <div className="bg-white rounded-lg shadow-sm min-w-[500px] p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">Order Summary</h2>

            {/* Cart Items List */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                    <CartItemCard key={item.product} item={item} />
                ))}
            </div>

            {/* Price Breakdown */}
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
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                Proceed to Payment
            </button>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
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
                                                            {isEditing && selectedAddress === address._id && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (window.confirm('Are you sure you want to delete this address?')) {
                                                                            handleDeleteAddress(address._id);
                                                                        }
                                                                    }}
                                                                    className="text-red-600 hover:text-red-800 text-sm ml-2 hover:cursor-pointer"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 text-sm">No addresses found</p>
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
                                            className="px-4 py-2 bg-[#003366] text-white rounded-md hover:cursor-pointer"
                                        >
                                            {isEditing ? 'Update Address' : 'Save Address'}
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
            </div>
        </>
    );
};

export default Shipping;