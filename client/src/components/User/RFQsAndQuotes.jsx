import React from 'react';

const RFQsAndQuotes = () => {
    // Mock data - replace with actual data from your API
    const rfqs = [
        {
            id: '#DHG-RFQ-001',
            date: '15 Jun, 2023',
            status: 'Quoted',
            items: 3,
            quotes: 2,
            expiry: '25 Jun, 2023'
        },
        {
            id: '#DHG-RFQ-002',
            date: '10 Jun, 2023',
            status: 'Pending',
            items: 5,
            quotes: 0,
            expiry: '20 Jun, 2023'
        },
        {
            id: '#DHG-RFQ-003',
            date: '05 Jun, 2023',
            status: 'Expired',
            items: 2,
            quotes: 1,
            expiry: '15 Jun, 2023'
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">My RFQ's & Quotes</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer">
                    + New RFQ
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFQ ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotes Received</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rfqs.map((rfq) => (
                            <tr key={rfq.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline hover:cursor-pointer">
                                    {rfq.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rfq.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${rfq.status === 'Quoted' ? 'bg-green-100 text-green-800' : 
                                          rfq.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        {rfq.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rfq.items} items
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rfq.quotes} {rfq.quotes === 1 ? 'quote' : 'quotes'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rfq.expiry}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4 hover:cursor-pointer">View</button>
                                    {rfq.quotes > 0 && (
                                        <button className="text-blue-600 hover:text-blue-900 hover:cursor-pointer">
                                            View Quotes
                                        </button>
                                    )}
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
                            Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of{' '}
                            <span className="font-medium">3</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:cursor-pointer">
                                <span className="sr-only">Previous</span>
                                &larr;
                            </a>
                            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-gray-50 hover:cursor-pointer">
                                1
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

export default RFQsAndQuotes;
