import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

const ViewQuotesModal = ({ isOpen, onClose, rfqId }) => {
    const { loading, quotes } = useSelector((state) => state.quoteList);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen && rfqId) {
            // The quotes are already loaded in the parent component
        }
    }, [isOpen, rfqId, dispatch]);

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return format(date, 'dd MMM, yyyy HH:mm');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const currentRFQ = quotes?.find(q => q._id === rfqId);
    const quoteItems = currentRFQ?.quotes || [];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Quotes for RFQ #{rfqId?.slice(-6).toUpperCase()}
                                </h3>
                                <div className="mt-4">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : quoteItems.length > 0 ? (
                                        <div className="space-y-6">
                                            <div className="flex flex-col">
                                                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote Amount</th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                                        <th scope="col" className="relative px-6 py-3">
                                                                            <span className="sr-only">Actions</span>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {quoteItems.map((quote, index) => (
                                                                        <tr key={index} className="hover:bg-gray-50">
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="flex items-center">
                                                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                                        <span className="text-gray-600 font-medium">
                                                                                            {quote.vendor?.name?.charAt(0) || 'V'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="ml-4">
                                                                                        <div className="text-sm font-medium text-gray-900">
                                                                                            {quote.vendor?.name || 'Vendor'}
                                                                                        </div>
                                                                                        <div className="text-sm text-gray-500">
                                                                                            {quote.vendor?.email || ''}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="text-sm text-gray-900 font-medium">
                                                                                    {formatCurrency(quote.totalAmount)}
                                                                                </div>
                                                                                <div className="text-sm text-gray-500">
                                                                                    {quote.validityDays ? `Valid for ${quote.validityDays} days` : ''}
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                                                    quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                                    'bg-yellow-100 text-yellow-800'
                                                                                }`}>
                                                                                    {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1) || 'Pending'}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {formatDate(quote.createdAt)}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                                <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                                                    View
                                                                                </button>
                                                                                <button 
                                                                                    className="text-green-600 hover:text-green-900"
                                                                                    // onClick={() => handleAcceptQuote(quote._id)}
                                                                                >
                                                                                    Accept
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-blue-700">
                                                            You've received {quoteItems.length} {quoteItems.length === 1 ? 'quote' : 'quotes'} for this RFQ.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No quotes yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">You haven't received any quotes for this RFQ yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewQuotesModal;
