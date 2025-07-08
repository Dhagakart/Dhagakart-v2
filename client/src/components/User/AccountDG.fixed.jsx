import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSnackbar } from 'notistack';
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
    logout as logoutAction, 
    updateProfile,
    addShippingAddress, 
    updateShippingAddress, 
    deleteShippingAddress,
    addBillingAddress,
    updateBillingAddress,
    deleteBillingAddress
} from '../../redux/actions/userActions';

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
    const { enqueueSnackbar } = useSnackbar();
    
    // Redux state
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const { error, isUpdated } = useSelector(state => state.profile);
    
    // Local state
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Address management
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isShipping, setIsShipping] = useState(true);
    
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
        isDefault: false,
        sameAsShipping: false
    });

    // Get addresses from user data
    const shippingAddresses = user?.shippingAddresses || [];
    const billingAddresses = user?.billingAddresses || [];

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/account?tab=${tab}`);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle logout
    const handleLogout = () => {
        dispatch(logoutAction());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Handle address form submission
    const handleAddressSubmit = (e) => {
        e.preventDefault();
        const addressData = {
            ...formData,
            isDefault: formData.isDefault
        };
        
        if (isShipping) {
            if (editingAddress) {
                dispatch(updateShippingAddress(editingAddress._id, addressData));
            } else {
                dispatch(addShippingAddress(addressData));
            }
        } else {
            if (editingAddress) {
                dispatch(updateBillingAddress(editingAddress._id, addressData));
            } else {
                dispatch(addBillingAddress(addressData));
            }
        }
        
        setShowShippingModal(false);
        setShowBillingModal(false);
        setEditingAddress(null);
    };

    // Handle edit address
    const handleEditAddress = (address, isShippingAddress = true) => {
        setIsShipping(isShippingAddress);
        setFormData({
            fullName: address.fullName,
            primaryAddress: address.primaryAddress,
            country: address.country || 'India',
            state: address.state,
            city: address.city,
            zipCode: address.zipCode,
            phoneNumber: address.phoneNumber,
            email: address.email,
            additionalInfo: address.additionalInfo || '',
            isDefault: address.isDefault || false,
            sameAsShipping: false
        });
        setEditingAddress(address);
        
        if (isShippingAddress) {
            setShowShippingModal(true);
        } else {
            setShowBillingModal(true);
        }
    };

    // Handle delete address
    const handleDeleteAddress = (addressId, isShippingAddress = true) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            if (isShippingAddress) {
                dispatch(deleteShippingAddress(addressId));
            } else {
                dispatch(deleteBillingAddress(addressId));
            }
        }
    };

    // Reset form when modal closes
    const handleModalClose = () => {
        setShowShippingModal(false);
        setShowBillingModal(false);
        setEditingAddress(null);
        setFormData({
            fullName: '',
            primaryAddress: '',
            city: '',
            state: '',
            country: 'India',
            zipCode: '',
            phoneNumber: '',
            email: user?.email || '',
            additionalInfo: '',
            isDefault: false,
            sameAsShipping: false
        });
    };

    // Set active tab from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <MetaData title="My Account" />
            
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleTabChange('profile')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        activeTab === 'profile' 
                                            ? 'bg-indigo-50 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <User className="mr-3 h-5 w-5" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => handleTabChange('orders')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        activeTab === 'orders' 
                                            ? 'bg-indigo-50 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <ShoppingBag className="mr-3 h-5 w-5" />
                                    My Orders
                                </button>
                                <button
                                    onClick={() => handleTabChange('track-order')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        activeTab === 'track-order' 
                                            ? 'bg-indigo-50 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Truck className="mr-3 h-5 w-5" />
                                    Track Order
                                </button>
                                <button
                                    onClick={() => handleTabChange('rfqs')}
                                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        activeTab === 'rfqs' 
                                            ? 'bg-indigo-50 text-indigo-700' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <FileText className="mr-3 h-5 w-5" />
                                    RFQs & Quotes
                                </button>
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-900 rounded-md"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                                </div>
                                <div className="px-6 py-5">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        // Handle profile update
                                    }}>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    value={user?.name || ''}
                                                    variant="outlined"
                                                    margin="normal"
                                                />
                                            </div>
                                            <div>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    value={user?.email || ''}
                                                    variant="outlined"
                                                    margin="normal"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                            >
                                                Update Profile
                                            </Button>
                                        </div>
                                    </form>

                                    {/* Shipping Addresses */}
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium">Shipping Addresses</h3>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Plus size={16} />}
                                                onClick={() => {
                                                    setIsShipping(true);
                                                    setShowShippingModal(true);
                                                    setFormData({
                                                        fullName: user?.name || '',
                                                        primaryAddress: '',
                                                        city: '',
                                                        state: '',
                                                        country: 'India',
                                                        zipCode: '',
                                                        phoneNumber: user?.phone || '',
                                                        email: user?.email || '',
                                                        additionalInfo: '',
                                                        isDefault: shippingAddresses.length === 0,
                                                        sameAsShipping: false
                                                    });
                                                }}
                                            >
                                                Add Shipping Address
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {shippingAddresses.length > 0 ? (
                                                shippingAddresses.map((address) => (
                                                    <Card key={address._id} className="relative">
                                                        <CardContent>
                                                            {address.isDefault && (
                                                                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Default
                                                                </span>
                                                            )}
                                                            <Typography variant="h6" component="div">
                                                                {address.fullName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {address.primaryAddress}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {address.city}, {address.state} {address.zipCode}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {address.country}
                                                            </Typography>
                                                            <div className="mt-2">
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Phone: {address.phoneNumber}
                                                                </Typography>
                                                                {address.email && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Email: {address.email}
                                                                    </Typography>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button
                                                                size="small"
                                                                startIcon={<Edit size={16} />}
                                                                onClick={() => handleEditAddress(address, true)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                startIcon={<Trash2 size={16} />}
                                                                onClick={() => handleDeleteAddress(address._id, true)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="col-span-2 text-center py-8 text-gray-500">
                                                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                                                    <Typography variant="h6" className="mt-2">
                                                        No shipping addresses
                                                    </Typography>
                                                    <Typography variant="body2" className="text-gray-500 mt-1">
                                                        You haven't added any shipping addresses yet.
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Billing Addresses */}
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium">Billing Addresses</h3>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Plus size={16} />}
                                                onClick={() => {
                                                    setIsShipping(false);
                                                    setShowBillingModal(true);
                                                    setFormData({
                                                        fullName: user?.name || '',
                                                        primaryAddress: '',
                                                        city: '',
                                                        state: '',
                                                        country: 'India',
                                                        zipCode: '',
                                                        phoneNumber: user?.phone || '',
                                                        email: user?.email || '',
                                                        additionalInfo: '',
                                                        isDefault: billingAddresses.length === 0,
                                                        sameAsShipping: false
                                                    });
                                                }}
                                            >
                                                Add Billing Address
                                            </Button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            {billingAddresses.length > 0 ? (
                                                billingAddresses.map((address) => (
                                                    <Card key={address._id} className="relative">
                                                        <CardContent>
                                                            {address.isDefault && (
                                                                <span className="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                    Default
                                                                </span>
                                                            )}
                                                            <Typography variant="h6" component="div">
                                                                {address.fullName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {address.primaryAddress}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {address.city}, {address.state} {address.zipCode}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {address.country}
                                                            </Typography>
                                                            <div className="mt-2">
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Phone: {address.phoneNumber}
                                                                </Typography>
                                                                {address.email && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Email: {address.email}
                                                                    </Typography>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button
                                                                size="small"
                                                                startIcon={<Edit size={16} />}
                                                                onClick={() => handleEditAddress(address, false)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                startIcon={<Trash2 size={16} />}
                                                                onClick={() => handleDeleteAddress(address._id, false)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </CardActions>
                                                    </Card>
                                                ))
                                            ) : (
                                                <div className="col-span-2 text-center py-8 text-gray-500">
                                                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                                                    <Typography variant="h6" className="mt-2">
                                                        No billing addresses
                                                    </Typography>
                                                    <Typography variant="body2" className="text-gray-500 mt-1">
                                                        You haven't added any billing addresses yet.
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && <OrderHistory />}
                        {activeTab === 'track-order' && <TrackOrder />}
                        {activeTab === 'rfqs' && <RFQsAndQuotes />}
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmationModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
            />

            {/* Shipping Address Modal */}
            <ShippingModal
                open={showShippingModal}
                onClose={handleModalClose}
                onSubmit={handleAddressSubmit}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                statesData={statesData}
            />

            {/* Billing Address Modal */}
            <BillingModal
                open={showBillingModal}
                onClose={handleModalClose}
                onSubmit={handleAddressSubmit}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                statesData={statesData}
            />
        </div>
    );
};

export default AccountDG;
