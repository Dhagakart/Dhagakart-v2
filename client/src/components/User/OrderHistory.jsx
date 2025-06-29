import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { myOrders } from '../../actions/orderAction';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

const OrderHistory = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const { loading, error, orders = [], pagination = {} } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);
    
    // Debug: Log the Redux state
    console.log('Redux State - myOrders:', { loading, error, orders, pagination });

    useEffect(() => {
        // Fetch orders when component mounts or currentPage changes
        console.log('Fetching orders for page:', currentPage);
        dispatch(myOrders(currentPage));
        
        // Cleanup function to reset loading state if component unmounts
        return () => {
            // Optional: Add cleanup if needed
        };
    }, [dispatch, currentPage]);

    const handlePageChange = (pageNumber) => {
        const newPage = Math.max(1, Math.min(pageNumber, pagination.totalPages || 1));
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
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
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    // Calculate pagination
    const totalPages = pagination?.totalPages || 1;
    const totalOrders = pagination?.totalOrders || 0;
    const startItem = totalOrders > 0 ? (currentPage - 1) * 10 + 1 : 0;
    const endItem = Math.min((currentPage - 1) * 10 + orders.length, totalOrders);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    if (loading && orders.length === 0) {
        return <Loader />;
    }
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    console.log('Orders:', orders);
    console.log('Pagination:', pagination);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <MetaData title="My Orders" />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Order History</h2>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="mt-1 text-gray-500">
                        You haven't placed any orders yet.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#003366] hover:bg-[#002244]"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.orderItems.reduce((total, item) => total + item.quantity, 0)} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                            {formatPrice(order.totalPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                to={`/order_details/${order._id}`}
                                                className="text-[#003366] hover:text-[#002244] hover:underline"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                            {loading && <div className="w-full text-center py-2">Loading...</div>}
                            
                            {/* Mobile Pagination */}
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!hasPreviousPage || loading}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                                        !hasPreviousPage || loading
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                <div className="text-sm text-gray-700 px-4 py-2 border border-gray-300 rounded-md">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!hasNextPage || loading}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                                        !hasNextPage || loading
                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                            
                            {/* Desktop Pagination */}
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{startItem}</span> to{' '}
                                        <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalOrders}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!hasPreviousPage || loading}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                                                !hasPreviousPage || loading
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === page
                                                        ? 'bg-blue-50 text-blue-600 border-blue-300'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                                disabled={loading}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!hasNextPage || loading}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                                                !hasNextPage || loading
                                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;