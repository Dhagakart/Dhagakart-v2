import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import OrderHistory from './OrderHistory';
import RFQsAndQuotes from './RFQsAndQuotes';
import TrackOrder from './TrackOrder';

// Icons
import { User, ShoppingBag, Truck, FileText, LogOut, FileSearch } from 'lucide-react';

const AccountDG = () => {
    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const [activeTab, setActiveTab] = useState('profile');

    const handleLogout = () => {
        // Logout logic here
        console.log('Logging out...');
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
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-r-md hover:cursor-pointer ${activeTab === 'profile' ? 'text-blue-700 bg-white border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <User className="mr-3 h-5 w-5" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-r-md hover:cursor-pointer ${activeTab === 'orders' ? 'text-blue-700 bg-white border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <ShoppingBag className="mr-3 h-5 w-5" />
                                    Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab('track-order')}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-r-md hover:cursor-pointer ${activeTab === 'track-order' ? 'text-blue-700 bg-white border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <Truck className="mr-3 h-5 w-5" />
                                    Track Order
                                </button>
                                <button
                                    onClick={() => setActiveTab('rfqs')}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-r-md hover:cursor-pointer ${activeTab === 'rfqs' ? 'text-blue-700 bg-white border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <FileSearch className="mr-3 h-5 w-5" />
                                    My RFQ's & Quotes
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md hover:cursor-pointer"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Log-out
                                </button>
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
