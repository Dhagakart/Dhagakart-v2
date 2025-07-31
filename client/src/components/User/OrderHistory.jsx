import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { myOrders, mySampleOrders } from '../../actions/orderAction'; // Import both actions
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

const OrderHistory = () => {
    const dispatch = useDispatch();

    // --- MODIFICATION: State to manage the active tab ---
    const [activeTab, setActiveTab] = useState('PURCHASES'); // 'PURCHASES' or 'SAMPLES'
    const [currentPage, setCurrentPage] = useState(1);

    // --- MODIFICATION: Select data from both Redux slices ---
    const { loading: purchasesLoading, orders: purchaseOrders, pagination: purchasePagination } = useSelector((state) => state.myOrders);
    const { loading: samplesLoading, orders: sampleOrders, pagination: samplePagination } = useSelector((state) => state.mySampleOrders);

    // --- MODIFICATION: Fetch data based on the active tab ---
    useEffect(() => {
        if (activeTab === 'PURCHASES') {
            dispatch(myOrders(currentPage));
        }
        if (activeTab === 'SAMPLES') {
            dispatch(mySampleOrders(currentPage));
        }
    }, [dispatch, currentPage, activeTab]);

    // Determine which data to display
    const isLoading = activeTab === 'SAMPLES' ? samplesLoading : purchasesLoading;
    const orders = activeTab === 'SAMPLES' ? sampleOrders : purchaseOrders;
    const pagination = activeTab === 'SAMPLES' ? samplePagination : purchasePagination;

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to page 1 when switching tabs
    };
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const totalPages = pagination?.totalPages || 1;

    if (isLoading && (!orders || orders.length === 0)) {
        return <Loader />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <MetaData title="My Orders" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order History</h2>

            {/* --- MODIFICATION: Tabs UI --- */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => handleTabClick('PURCHASES')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:cursor-pointer ${
                            activeTab === 'PURCHASES'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Purchase History
                    </button>
                    <button
                        onClick={() => handleTabClick('SAMPLES')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:cursor-pointer ${
                            activeTab === 'SAMPLES'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Sample History
                    </button>
                </nav>
            </div>

            {(!orders || orders.length === 0) ? (
                <div className="text-center py-12">
                    {/* ... (empty state UI) ... */}
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-1 text-gray-500">You haven't placed any {activeTab === 'SAMPLES' ? 'sample' : ''} orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                                            {/* --- MODIFICATION: Add Sample Badge --- */}
                                            {order.isSampleOrder && (
                                                <span className="ml-2 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Sample</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderItems.length}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{formatPrice(order.totalPrice)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/order_details/${order._id}`} className="text-[#003366] hover:text-[#002244] hover:underline">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* ... Pagination Controls ... */}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;