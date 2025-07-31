import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
// FIX: Import the correct action for the sample cart
import { saveSampleShippingInfo } from '../../actions/cartAction';
import { 
    addShippingAddress, 
    updateShippingAddress, 
    deleteShippingAddress,
    clearErrors 
} from '../../actions/userAction';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';
// --- MODIFICATION: Added FaFlask for the banner icon ---
import { FaFlask } from 'react-icons/fa';

const SampleShipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { sampleCartItems: cartItems, sampleShippingInfo: shippingInfo } = useSelector((state) => state.sampleCart);
    const { user, loading, error, isUpdated, isDeleted } = useSelector((state) => state.user);
    
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isNewAddress, setIsNewAddress] = useState(false);
    
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

    useEffect(() => {
        if (user) {
            setAddresses(user.shippingAddresses || []);
            
            if (user.shippingAddresses?.length > 0) {
                const defaultAddress = user.shippingAddresses.find(addr => addr.isDefault) || user.shippingAddresses[0];
                setSelectedAddress(defaultAddress._id);
                handleAddressSelect(defaultAddress);
            }
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        
        if (isDeleted) {
            toast.success('Address deleted successfully');
            dispatch({ type: 'DELETE_SHIPPING_ADDRESS_RESET' });
        }
        
        if (isUpdated) {
            toast.success('Address updated successfully');
            dispatch({ type: 'UPDATE_SHIPPING_ADDRESS_RESET' });
            
            setIsEditing(false);
            setIsNewAddress(false);
        }
    }, [dispatch, error, isDeleted, isUpdated]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddressSelect = (address) => {
        if (!address) return;
        setSelectedAddress(address._id);
    
        // FIX: Dispatch the correct action to save to the sample cart's state
        dispatch(saveSampleShippingInfo({
            address: address.primaryAddress,
            city: address.city,
            state: address.state,
            pincode: address.zipCode,
            phoneNo: address.phoneNumber,
            country: address.country,
            email: address.email
        }));
    };

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
                const updatedAddresses = updatedUser.shippingAddresses || [];
                setAddresses(updatedAddresses);
                
                if (formData.isDefault || !selectedAddress) {
                    const newAddress = updatedAddresses[updatedAddresses.length - 1];
                    if (newAddress) {
                        setSelectedAddress(newAddress._id);
                        handleAddressSelect(newAddress);
                    }
                }
                
                setIsNewAddress(false);
                setIsEditing(false);
                setFormData({ fullName: '', primaryAddress: '', city: '', state: '', country: 'India', zipCode: '', phoneNumber: '', email: '', additionalInfo: '', isDefault: false });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateAddress = async (e) => {
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
            isDefault: formData.isDefault
        };
        
        try {
            const updatedUser = await dispatch(updateShippingAddress(selectedAddress, addressData));
            
            if (updatedUser) {
                setAddresses(updatedUser.shippingAddresses || []);
                
                if (selectedAddress) {
                    const updatedAddress = updatedUser.shippingAddresses.find(addr => addr._id === selectedAddress);
                    if (updatedAddress) {
                        handleAddressSelect(updatedAddress);
                    }
                }
                
                setIsEditing(false);
                setIsNewAddress(false);
                setFormData({ fullName: '', primaryAddress: '', city: '', state: '', country: 'India', zipCode: '', phoneNumber: '', email: '', additionalInfo: '', isDefault: false });
                toast.success('Address updated successfully');
            } else {
                toast.error('Failed to update address');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update address');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const confirmDeleteAddress = (id, e) => {
        e.stopPropagation();
        setAddressToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAddressToDelete(null);
    };

    const handleDeleteAddress = async () => {
        if (!addressToDelete) return;
        
        try {
            const result = await dispatch(deleteShippingAddress(addressToDelete));
            
            if (result && result.success) {
                const updatedUser = result.user || user;
                const updatedAddresses = updatedUser.shippingAddresses || [];
                
                setAddresses(updatedAddresses);
                
                if (selectedAddress === addressToDelete) {
                    setSelectedAddress(null);
                    dispatch(saveShippingInfo({}));
                    
                    if (updatedAddresses.length > 0) {
                        const firstAddress = updatedAddresses[0];
                        setSelectedAddress(firstAddress._id);
                        handleAddressSelect(firstAddress);
                    }
                }
                
                toast.success('Address deleted successfully');
                closeDeleteModal();
                setIsEditing(false);
                setIsNewAddress(false);
            } else {
                toast.error('Failed to delete address');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to delete address');
            closeDeleteModal();
        }
    };

    const handleProceedToPayment = () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address.');
            return;
        }
        navigate('/process/payment');
    };

    const calculateCartTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const sgst = subtotal * 0.05;
        const cgst = subtotal * 0.05;
        const totalGst = sgst + cgst;
        const shippingCharges = subtotal > 500 ? 0 : 100;
        const finalTotal = subtotal + totalGst + shippingCharges;
        
        return { subtotal, sgst, cgst, totalGst, shippingCharges, finalTotal };
    };

    const { subtotal, sgst, cgst, totalGst, shippingCharges, finalTotal } = calculateCartTotals();

    const PriceRow = ({ label, value, isTotal = false }) => (
        <div className={`flex justify-between ${isTotal ? 'pt-3 mt-3 border-t border-gray-200' : ''}`}>
            <span className={`${isTotal ? 'font-semibold' : 'text-gray-600'} ${isTotal ? 'text-lg' : 'text-base'}`}>
                {label}
            </span>
            <span className={`${isTotal ? 'text-green-600' : 'font-medium'} ${isTotal ? 'text-lg font-semibold' : 'text-base'}`}>
                {value}
            </span>
        </div>
    );
    
    // --- MODIFICATION: Added 'Sample' badge to item card ---
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
                <h3 className="text-sm font-medium line-clamp-2">
                    {item.name}
                    <span className="ml-2 text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full align-middle">
                        Sample
                    </span>
                </h3>
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Sample Order Summary</h2>
            
            {/* --- MODIFICATION: The item list has been removed from this section --- */}
            <div className="space-y-3">
                <PriceRow label={`Subtotal (${cartItems.length} items)`} value={formatPrice(subtotal)} />
                <PriceRow label="SGST (5%)" value={formatPrice(sgst)} />
                <PriceRow label="CGST (5%)" value={formatPrice(cgst)} />
                <PriceRow label="Shipping Charges" value={formatPrice(shippingCharges)} />
                <PriceRow label="Total Amount" value={formatPrice(finalTotal)} isTotal />
            </div>
            
            <button
                onClick={handleProceedToPayment}
                disabled={!selectedAddress}
                className={`w-full text-white py-3 rounded-md transition-all duration-300 mt-6 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${!selectedAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003366] hover:bg-[#002b57] hover:cursor-pointer'}`}
            >
                Confirm & Proceed to Payment
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
            {/* --- MODIFICATION: Updated Meta Title for SEO and context --- */}
            <MetaData title="Sample Order: Shipping Details" />
            <div className="container mx-auto min-h-screen px-4 sm:px-6 md:px-16 py-6 sm:py-8 mt-6 sm:mt-10">
                
                {/* --- MODIFICATION: Added informational banner --- */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <div className="flex items-center">
                        {/* <FaFlask className="text-blue-600 mr-3 h-5 w-5 flex-shrink-0" /> */}
                        <div>
                            <h3 className="font-semibold text-blue-800">Confirm Shipping for Sample Order</h3>
                            <p className="text-sm text-blue-700 mt-1">Please select or add the address where your samples should be delivered.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-2/3">
                        {!isNewAddress && !isEditing ? (
                            <div className="p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                                    {/* --- MODIFICATION: Updated main heading for clarity --- */}
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Shipping Address for Samples</h2>
                                    <button
                                        onClick={() => {
                                            setIsNewAddress(true);
                                            setFormData({ fullName: '', companyName: '', primaryAddress: '', city: '', state: '', country: 'India', zipCode: '', phoneNumber: '', email: '', additionalInfo: '', isDefault: false });
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
                                                className={`border rounded-lg p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 cursor-pointer transition-all duration-200 hover:border-blue-300 ${selectedAddress === address._id ? 'border-blue-500 bg-blue-50' : 'bg-white border-gray-200'}`}
                                                onClick={() => handleAddressSelect(address)}
                                            >
                                                <div className="flex items-center h-5 mt-1">
                                                    <div className={`h-4 w-4 border-2 rounded-full flex items-center justify-center transition-colors duration-200 ${selectedAddress === address._id ? 'border-blue-500' : 'border-gray-400'}`}> 
                                                        {selectedAddress === address._id && (
                                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start">
                                                        <div className="space-y-2">
                                                            <h3 className="font-semibold text-gray-800">{address.fullName}</h3>
                                                            <p className="text-gray-600 text-sm">{address.primaryAddress}, {address.city}, {address.state}, {address.country}, {address.zipCode}</p>
                                                            <p className="text-gray-600 text-sm">
                                                                <span className="font-medium">Phone: </span>{address.phoneNumber}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-row space-x-4 mt-2 sm:mt-0">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFormData({ ...address });
                                                                    setIsEditing(true);
                                                                    setSelectedAddress(address._id);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => confirmDeleteAddress(address._id, e)}
                                                                className="text-red-600 hover:text-red-800 text-sm font-medium ml-2 hover:cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p>No addresses found. Please add a new address to continue.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border border-gray-200">
                                <h3 className="text-lg font-bold mb-4">
                                    {isEditing ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <form onSubmit={isEditing ? handleUpdateAddress : handleAddAddress}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                            <input name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name (Optional)" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                        <input name="primaryAddress" value={formData.primaryAddress} onChange={handleInputChange} placeholder="Address" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <select name="country" value={formData.country} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"><option value="India">India</option></select>
                                            <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                            <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="Zip Code" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email ID" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        </div>
                                        <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} placeholder="Order Notes (Optional)" rows="3" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button type="button" onClick={() => { setIsNewAddress(false); setIsEditing(false); }} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className={`px-4 py-2 bg-[#003366] text-white rounded hover:bg-[#00264d] transition-colors ${isSubmitting ? 'opacity-75' : ''}`}>{isSubmitting ? 'Saving...' : 'Save Address'}</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-1/3">
                        <div className="md:sticky md:top-24">
                            {renderPriceSidebar()}
                        </div>
                    </div>
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl border max-w-md w-full">
                            <h3 className="text-lg font-semibold text-gray-900">Delete Address</h3>
                            <p className="text-gray-700 my-4">Are you sure you want to delete this address? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                                <button onClick={closeDeleteModal} className="px-4 py-2 border rounded">Cancel</button>
                                <button onClick={handleDeleteAddress} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SampleShipping;