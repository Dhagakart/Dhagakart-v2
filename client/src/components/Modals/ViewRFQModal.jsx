import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

const ViewRFQModal = ({ isOpen, onClose, rfqId }) => {
    const { loading, quote } = useSelector((state) => state.quoteDetails);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen && rfqId) {
            // dispatch(getQuoteDetails(rfqId));
        }
    }, [isOpen, rfqId, dispatch]);

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return format(date, 'dd MMM, yyyy HH:mm');
    };

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
                                    RFQ Details
                                </h3>
                                <div className="mt-4">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : quote ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">RFQ ID</p>
                                                    <p className="font-medium">{quote._id?.slice(-6).toUpperCase()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Status</p>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        quote.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Created On</p>
                                                    <p className="font-medium">{formatDate(quote.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Expires On</p>
                                                    <p className="font-medium">{formatDate(quote.expiryDate) || 'N/A'}</p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Products</p>
                                                <div className="bg-gray-50 p-4 rounded-md">
                                                    {quote.products?.length > 0 ? (
                                                        <ul className="divide-y divide-gray-200">
                                                            {quote.products.map((product, index) => (
                                                                <li key={index} className="py-2">
                                                                    <p className="font-medium">{product.name || `Product ${index + 1}`}</p>
                                                                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mt-1">
                                                                        <span>Qty: {product.quantity}</span>
                                                                        {product.unit && <span>Unit: {product.unit}</span>}
                                                                    </div>
                                                                    {product.description && (
                                                                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500">No products added</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {quote.comments && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Additional Comments</p>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                                        {quote.comments}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {quote.file && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Attached File</p>
                                                    <a 
                                                        href={quote.file.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                    >
                                                        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        {quote.file.originalname || 'Download File'}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No RFQ details found.</p>
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

export default ViewRFQModal;
