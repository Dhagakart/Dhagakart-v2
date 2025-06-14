import React from 'react';

const OrderHistory = () => {
    // Mock data - replace with actual data from your API
    const orders = [
        {
            id: '#DHG-ORD-001',
            date: '12 Jun, 2023',
            status: 'Delivered',
            total: '₹1,299.00',
            items: 2
        },
        {
            id: '#DHG-ORD-002',
            date: '12 Jun, 2023',
            status: 'Delivered',
            total: '₹1,299.00',
            items: 2
        },
        {
            id: '#DHG-ORD-003',
            date: '12 Jun, 2023',
            status: 'Delivered',
            total: '₹1,299.00',
            items: 2
        },
        {
            id: '#DHG-ORD-004',
            date: '12 Jun, 2023',
            status: 'Delivered',
            total: '₹1,299.00',
            items: 2
        },
        {
            id: '#DHG-ORD-005',
            date: '12 Jun, 2023',
            status: 'Delivered',
            total: '₹1,299.00',
            items: 2
        },
        {
            id: '#DHG-ORD-006',
            date: '12 Jun, 2023',
            status: 'Delivered',
            total: '₹1,299.00',
            items: 2
        },
        // Add more mock orders as needed
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Order History</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm hover:cursor-pointer">
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>All orders</option>
                    </select>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline hover:cursor-pointer">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.items} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4 hover:cursor-pointer">View</button>
                                    <button className="text-blue-600 hover:text-blue-900 hover:cursor-pointer">Track</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:cursor-pointer">
                        Previous
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:cursor-pointer">
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                            <span className="font-medium">20</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:cursor-pointer">
                                <span className="sr-only">Previous</span>
                                &larr;
                            </a>
                            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                1
                            </a>
                            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-gray-50 hover:cursor-pointer">
                                2
                            </a>
                            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                3
                            </a>
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:cursor-pointer">
                                <span className="sr-only">Next</span>
                                &rarr;
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
