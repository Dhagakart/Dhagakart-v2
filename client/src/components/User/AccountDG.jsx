import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Box, 
    IconButton,
    Typography,
    Divider,
    Button,
    TextField,
    CircularProgress,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { 
    User, 
    ShoppingBag, 
    Truck, 
    FileText, 
    LogOut, 
    FileSearch, 
    MapPin, 
    CreditCard, 
    Edit, 
    Trash2, 
    Plus 
} from 'lucide-react';

// Redux Actions
import { 
    logoutUser as logoutAction, 
    updateProfile,
    addShippingAddress, 
    updateShippingAddress, 
    deleteShippingAddress,
    addBillingAddress,
    updateBillingAddress,
    deleteBillingAddress
} from '../../actions/userAction';

// Components
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import OrderHistory from './OrderHistory';
import RFQsAndQuotes from './RFQsAndQuotes';
import TrackOrder from './TrackOrder';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import ShippingModal from './modals/ShippingModal';
import BillingModal from './modals/BillingModal';

// Utils
import statesData from '../../utils/states';

const AccountDG = ({ defaultTab = 'profile' }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redux state
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const { error, isUpdated } = useSelector(state => state.profile);
    
    // Local state
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [addressType, setAddressType] = useState(null);
    const [editingAddress, setEditingAddress] = useState(null);
    
    // Form states
    const [profileFormData, setProfileFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        businessName: '',
        businessType: ''
    });
    
    const [addressFormData, setAddressFormData] = useState({
        fullName: '',
        primaryAddress: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        phoneNumber: '',
        email: '',
        additionalInfo: '',
        isDefault: false,
        sameAsShipping: false
    });

    // Get addresses from user data
    const shippingAddresses = user?.shippingAddresses || [];
    const billingAddresses = user?.billingAddresses || [];
    
    // Update active tab based on URL
    useEffect(() => {
        const path = location.pathname.split('/').pop();
        switch(path) {
            case 'orders':
                setActiveTab('orders');
                break;
            case 'track-order':
                setActiveTab('track-order');
                break;
            case 'rfqs':
                setActiveTab('rfqs');
                break;
            case 'profile':
            default:
                setActiveTab('profile');
        }
    }, [location]);

    const handleLogout = () => {
        dispatch(logoutAction());
        toast.success("Logout Successful");
        navigate("/login");
    };

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        } else if (user) {
            setProfileFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                businessName: user.businessName || '',
                businessType: user.businessType || ''
            });
        }
    }, [isAuthenticated, navigate, user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'CLEAR_ERRORS' });
        }
        if (isUpdated) {
            toast.success('Profile updated successfully');
            dispatch({ type: 'LOAD_USER' });
            dispatch({ type: 'UPDATE_PROFILE_RESET' });
            setIsEditing(false);
        }
    }, [dispatch, error, isUpdated]);

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        setProfileFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        dispatch(updateProfile(profileFormData))
            .unwrap()
            .then(() => {
                toast.success('Profile updated successfully');
            })
            .catch((error) => {
                toast.error(error?.message || 'Failed to update profile');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleAddShippingAddress = () => {
        setAddressType('shipping');
        setEditingAddress(null);
        setAddressFormData({
            fullName: '',
            primaryAddress: '',
            city: '',
            state: '',
            country: 'India',
            zipCode: '',
            phoneNumber: '',
            email: user?.email || '',
            additionalInfo: '',
            isDefault: shippingAddresses.length === 0
        });
        setShowShippingModal(true);
    };

    const handleAddBillingAddress = () => {
        setAddressType('billing');
        setEditingAddress(null);
        setAddressFormData({
            fullName: '',
            companyName: '',
            primaryAddress: '',
            city: '',
            state: '',
            country: 'India',
            zipCode: '',
            phoneNumber: '',
            email: user?.email || '',
            additionalInfo: '',
            isDefault: billingAddresses.length === 0,
            sameAsShipping: false
        });
        setShowBillingModal(true);
    };

    const handleEditAddress = (address, type) => {
        setAddressType(type);
        setEditingAddress(address);
        setAddressFormData({
            ...address,
            isDefault: address.isDefault || false
        });
        if (type === 'shipping') {
            setShowShippingModal(true);
        } else {
            setShowBillingModal(true);
        }
    };

    const handleAddressSubmit = async (formData) => {
        try {
            const addressType = showShippingModal ? 'shipping' : 'billing';
            const addressId = editingAddress?._id;
    
            if (addressId) {
                // Update existing address
                if (addressType === 'shipping') {
                    await dispatch(updateShippingAddress({ id: addressId, addressData: formData }));
                } else {
                    await dispatch(updateBillingAddress({ id: addressId, addressData: formData }));
                }
            } else {
                // Add new address
                if (addressType === 'shipping') {
                    await dispatch(addShippingAddress(formData));
                } else {
                    await dispatch(addBillingAddress(formData));
                }
            }
    
            toast.success(
                `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} address ${addressId ? 'updated' : 'added'} successfully`
            );
            
            // Close modals and reset state
            setShowShippingModal(false);
            setShowBillingModal(false);
            setEditingAddress(null);
            
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error(error.message || 'Failed to save address. Please try again.');
        }
    };

    const handleDeleteAddress = async (addressId, type) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const action = type === 'shipping' 
                    ? deleteShippingAddress(addressId)
                    : deleteBillingAddress(addressId);
                
                await dispatch(action);
    
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} address deleted successfully`);
    
            } catch (error) {
                console.error('Error deleting address:', error);
                toast.error(error.message || `Failed to delete ${type} address`);
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 mt-10 lg:p-8">
            <MetaData title="My Profile" />
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64">
                        <div className="bg-gray-100 rounded-lg shadow-sm py-4">
                            <nav className="space-y-1">
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => navigate('/account/profile')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/account/orders')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        <span>Order History</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/account/track-order')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'track-order' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
                                    >
                                        <Truck className="h-5 w-5" />
                                        <span>Track Order</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/account/rfqs')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'rfqs' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}
                                    >
                                        <FileSearch className="h-5 w-5" />
                                        <span>My RFQ's & Quotes</span>
                                    </button>
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => navigate('/admin/dashboard')}
                                            className="flex items-center gap-2 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer w-full text-left"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.707-.707a1 1 0 000-1.414l-7-7z" />
                                            </svg>
                                            <span>Admin Dashboard</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Modals */}

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        {activeTab === 'profile' && (
                            <>
                                {/* General Information */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center pb-4">
                                        <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
                                        {!isEditing ? (
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                                            >
                                                Edit Details
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        if (user) {
                                                            setProfileFormData({
                                                                name: user.name || '',
                                                                email: user.email || '',
                                                                phone: user.phone || '',
                                                                city: user.city || '',
                                                                businessName: user.businessName || '',
                                                                businessType: user.businessType || ''
                                                            });
                                                        }
                                                    }}
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    type="submit"
                                                    form="profile-form"
                                                    disabled={isSubmitting}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Saving...
                                                        </>
                                                    ) : 'Save Changes'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <form id="profile-form" onSubmit={handleSubmit} className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                                <TextField
                                                    fullWidth
                                                    name="name"
                                                    value={profileFormData.name}
                                                    onChange={handleProfileInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                                <TextField
                                                    fullWidth
                                                    type="email"
                                                    name="email"
                                                    value={profileFormData.email}
                                                    onChange={handleProfileInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                                <TextField
                                                    fullWidth
                                                    type="tel"
                                                    name="phone"
                                                    value={profileFormData.phone}
                                                    onChange={handleProfileInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                                                <TextField
                                                    fullWidth
                                                    name="city"
                                                    value={profileFormData.city}
                                                    onChange={handleProfileInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                                                <TextField
                                                    fullWidth
                                                    name="businessName"
                                                    value={profileFormData.businessName}
                                                    onChange={handleProfileInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
                                                <TextField
                                                    fullWidth
                                                    name="businessType"
                                                    value={profileFormData.businessType}
                                                    onChange={handleProfileInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Address Sections */}
                                <div className="space-y-8">
                                    {/* Shipping Address Section */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                                Shipping Addresses
                                            </h2>
                                            <button 
                                                onClick={handleAddShippingAddress}
                                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add New
                                            </button>
                                        </div>
                                        {shippingAddresses.length > 0 ? (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {shippingAddresses.map((address) => (
                                                    <div key={address._id} className="border border-gray-200 rounded-lg p-4 relative group">
                                                        {address.isDefault && (
                                                            <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                        <div className="font-medium text-gray-900">{address.fullName}</div>
                                                        <p className="text-gray-600 mt-1">{address.primaryAddress}</p>
                                                        <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                                                        <p className="text-gray-600">{address.country}</p>
                                                        <div className="mt-2 text-sm text-gray-500">
                                                            <div>Phone: {address.phoneNumber}</div>
                                                            {address.email && <div>Email: {address.email}</div>}
                                                        </div>
                                                        <div className="mt-3 flex space-x-2">
                                                            <button 
                                                                onClick={() => handleEditAddress(address, 'shipping')}
                                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                            >
                                                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDeleteAddress(e, address._id, 'shipping')}
                                                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center">No shipping addresses found.</p>
                                        )}
                                    </div>

                                    {/* Billing Address Section */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                                                Billing Addresses
                                            </h2>
                                            <button 
                                                onClick={handleAddBillingAddress}
                                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add New
                                            </button>
                                        </div>
                                        {billingAddresses.length > 0 ? (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {billingAddresses.map((address) => (
                                                    <div key={address._id} className="border border-gray-200 rounded-lg p-4 relative group">
                                                        {address.isDefault && (
                                                            <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                                Default
                                                            </span>
                                                        )}
                                                        <div className="font-medium text-gray-900">{address.fullName}</div>
                                                        <p className="text-gray-600 mt-1">{address.primaryAddress}</p>
                                                        <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                                                        <p className="text-gray-600">{address.country}</p>
                                                        <div className="mt-2 text-sm text-gray-500">
                                                            <div>Phone: {address.phoneNumber}</div>
                                                            {address.email && <div>Email: {address.email}</div>}
                                                        </div>
                                                        <div className="mt-3 flex space-x-2">
                                                            <button 
                                                                onClick={() => handleEditAddress(address, 'billing')}
                                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                            >
                                                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDeleteAddress(e, address._id, 'billing')}
                                                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-center">No billing addresses found.</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'rfqs' && <RFQsAndQuotes />}
                        {activeTab === 'track-order' && <TrackOrder />}
                    </main>
                </div>
            </div>
            
            {/* Logout Confirmation Modal */}
            <LogoutConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
            
            {/* Shipping Address Modal */}
            <ShippingModal
                open={showShippingModal}
                onClose={() => setShowShippingModal(false)}
                onSubmit={handleAddressSubmit}
                shippingDetails={editingAddress || {}}
                setShippingDetails={(data) => setAddressFormData(prev => ({
                    ...prev,
                    ...data
                }))}
                user={user}
                shippingAddresses={user?.shippingAddresses || []}
            />
            
            {/* Billing Address Modal */}
            <BillingModal
                open={showBillingModal}
                onClose={() => setShowBillingModal(false)}
                onSubmit={handleAddressSubmit}
                billingDetails={editingAddress || {}}
                setBillingDetails={(data) => setAddressFormData(prev => ({
                    ...prev,
                    ...data
                }))}
                user={user}
                billingAddresses={user?.billingAddresses || []}
            />
        </div>
    );
};

export default AccountDG;
