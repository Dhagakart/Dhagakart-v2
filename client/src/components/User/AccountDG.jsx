import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import OrderHistory from './OrderHistory';
import RFQsAndQuotes from './RFQsAndQuotes';
import TrackOrder from './TrackOrder';
import { logoutUser } from '../../actions/userAction';
import LogoutConfirmationModal from './LogoutConfirmationModal';

// Icons
import { User, ShoppingBag, Truck, FileText, LogOut, FileSearch } from 'lucide-react';

const AccountDG = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const [activeTab, setActiveTab] = useState('profile');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        enqueueSnackbar("Logout Successful", { variant: "success" });
        navigate("/login");
    };

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

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
                                        onClick={() => setActiveTab('profile')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        <span>Order History</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('track-order')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'track-order' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <Truck className="h-5 w-5" />
                                        <span>Track Order</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('rfqs')}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg ${activeTab === 'rfqs' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'} hover:cursor-pointer`}
                                    >
                                        <FileSearch className="h-5 w-5" />
                                        <span>My RFQ's & Quotes</span>
                                    </button>
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
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer">
                                            Edit Details
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={user?.name || 'Badal Singh'}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={user?.phone || '+91 50394 03932'}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Email ID</label>
                                            <input
                                                type="email"
                                                readOnly
                                                value={user?.email || 'Dhagakart@gmail.com'}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={user?.businessName || 'Dhagakart'}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Business Type</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={user?.businessType || 'Retailer'}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Billing Address */}
                                    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
                                        <div className="flex justify-between items-center pb-4">
                                            <h2 className="text-lg font-semibold text-gray-800 uppercase">Billing Address</h2>
                                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium">
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
                                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium">
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
