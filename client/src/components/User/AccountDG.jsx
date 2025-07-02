import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TextField, Button } from '@mui/material';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import toast from 'react-hot-toast';
import OrderHistory from './OrderHistory';
import RFQsAndQuotes from './RFQsAndQuotes';
import TrackOrder from './TrackOrder';
import { logoutUser, updateProfile, clearErrors } from '../../actions/userAction';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import { loadUser } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';

// Icons
import { User, ShoppingBag, Truck, FileText, LogOut, FileSearch } from 'lucide-react';

const AccountDG = ({ defaultTab = 'profile' }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const { error, isUpdated } = useSelector(state => state.profile);
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        businessName: '',
        businessType: ''
    });
    
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
        dispatch(logoutUser());
        enqueueSnackbar("Logout Successful", { variant: "success" });
        navigate("/login");
    };

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        } else if (user) {
            setFormData({
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
            enqueueSnackbar(error, { variant: 'error' });
            toast.error(error, {
                position: 'top-right',
                duration: 3000,
            });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
            toast.success('Profile updated successfully!', {
                position: 'top-right',
                duration: 3000,
            });
            dispatch(loadUser());
            dispatch({ type: UPDATE_PROFILE_RESET });
            setIsEditing(false);
        }
    }, [dispatch, error, isUpdated, enqueueSnackbar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
            myForm.set(key, value);
        });
        
        setIsSubmitting(true);
        
        dispatch(updateProfile(myForm))
            .unwrap()
            .then(() => {
                toast.success('Profile updated successfully!', {
                    position: 'top-right',
                    duration: 3000,
                });
            })
            .catch((error) => {
                toast.error(error?.message || 'Failed to update profile', {
                    position: 'top-right',
                    duration: 3000,
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
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
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/account/orders')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        <span>Order History</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/account/track-order')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'track-order' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <Truck className="h-5 w-5" />
                                        <span>Track Order</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/account/rfqs')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'rfqs' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <FileSearch className="h-5 w-5" />
                                        <span>My RFQ's & Quotes</span>
                                    </button>
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => navigate('/admin/dashboard')}
                                            className="flex items-center gap-2 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:cursor-pointer w-full text-left"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                            </svg>
                                            <span>Admin Dashboard</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 hover:cursor-pointer"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                                <LogoutConfirmationModal 
                                    isOpen={showLogoutConfirm}
                                    onCancel={() => setShowLogoutConfirm(false)}
                                    onConfirm={handleLogout}
                                />
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-6">
                        {activeTab === 'profile' ? (
                            <>
                                {/* General Information */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center pb-4">
                                        <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
                                        {!isEditing ? (
                                            <button 
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer"
                                            >
                                                Edit Details
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        // Reset form data to original user data
                                                        if (user) {
                                                            setFormData({
                                                                name: user.name || '',
                                                                email: user.email || '',
                                                                phone: user.phone || '',
                                                                city: user.city || '',
                                                                businessName: user.businessName || '',
                                                                businessType: user.businessType || ''
                                                            });
                                                        }
                                                    }}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer flex items-center justify-center gap-2 min-w-[120px] ${isSubmitting ? 'opacity-75' : ''}`}
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
                                    <form onSubmit={handleSubmit} className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                                <TextField
                                                    fullWidth
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                                <TextField
                                                    fullWidth
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                                <TextField
                                                    fullWidth
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
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
                                                    value={formData.city}
                                                    onChange={handleInputChange}
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
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
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
                                                    value={formData.businessType}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    variant="outlined"
                                                    size="small"
                                                    select
                                                    SelectProps={{ native: true }}
                                                >
                                                    <option value="">Select Business Type</option>
                                                    <option value="Manufacturer">Manufacturer</option>
                                                    <option value="Wholesaler">Wholesaler</option>
                                                    <option value="Retailer">Retailer</option>
                                                    <option value="Distributor">Distributor</option>
                                                    <option value="Service Provider">Service Provider</option>
                                                    <option value="Other">Other</option>
                                                </TextField>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Address Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Billing Address */}
                                    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-center pb-4">
                                            <h2 className="text-lg font-semibold text-gray-800 uppercase">Billing Address</h2>
                                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer">
                                                Edit Address
                                            </button>
                                        </div>
                                        <div className="space-y-2 flex-grow">
                                            <div className="font-medium text-gray-800">Kevin Gilbert</div>
                                            <p className="text-gray-600">
                                                East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh
                                            </p>
                                            <div className="text-gray-600">Phone Number: +1-202-555-0118</div>
                                            <div className="text-gray-600">Email: kevin.gilbert@gmail.com</div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-center pb-4">
                                            <h2 className="text-lg font-semibold text-gray-800 uppercase">Shipping Address</h2>
                                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer">
                                                Edit Address
                                            </button>
                                        </div>
                                        <div className="space-y-2 flex-grow">
                                            <div className="font-medium text-gray-800">Kevin Gilbert</div>
                                            <p className="text-gray-600">
                                                East Tejturi Bazar, Word No. 04, Road No. 13/x, House no. 1320/C, Flat No. 5D, Dhaka - 1200, Bangladesh
                                            </p>
                                            <div className="text-gray-600">Phone Number: +1-202-555-0118</div>
                                            <div className="text-gray-600">Email: kevin.gilbert@gmail.com</div>
                                        </div>
                                    </div>
                                </div>

                            </>
                        ) : activeTab === 'orders' ? (
                            <OrderHistory />
                        ) : activeTab === 'rfqs' ? (
                            <RFQsAndQuotes />
                        ) : activeTab === 'track-order' ? (
                            <TrackOrder />
                        ) : null}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AccountDG;
