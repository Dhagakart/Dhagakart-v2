import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import { format } from 'date-fns';
import { getMyQuotes } from '../../actions/quoteActions';
import { Dialog, DialogContent, IconButton, Chip, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DescriptionIcon from '@mui/icons-material/Description';

const RFQsAndQuotes = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Fixed at 10 items per page
    const [selectedRFQ, setSelectedRFQ] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { 
        loading, 
        error, 
        quotes = [], 
        quotesCount = 0, 
        totalPages = 1,
        currentPage: currentPageFromState = 1,
        hasNextPage = false,
        hasPreviousPage = false
    } = useSelector((state) => state.quoteList || {});

    // Log state for debugging
    useEffect(() => {
        console.log('Pagination State:', {
            quotesCount,
            totalPages,
            currentPage,
            hasNextPage,
            hasPreviousPage,
            quotesLength: quotes.length
        });
    }, [quotesCount, totalPages, currentPage, hasNextPage, hasPreviousPage, quotes]);

    // Sync local state with Redux state
    useEffect(() => {
        if (currentPageFromState !== currentPage) {
            setCurrentPage(currentPageFromState);
        }
    }, [currentPageFromState]);

    // Fetch quotes on mount and when page changes
    useEffect(() => {
        if (error) {
            console.error('Error:', error);
        }
        dispatch(getMyQuotes(currentPage, itemsPerPage));
    }, [dispatch, currentPage, itemsPerPage]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return format(date, 'dd MMM, yyyy');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !loading) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNewRFQ = () => {
        navigate('/bulkorder');
    };

    const handleViewRFQ = (quote) => {
        setSelectedRFQ(quote);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRFQ(null);
    };

    const handleDownloadFile = (fileUrl) => {
        window.open(fileUrl, '_blank');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'processing':
                return 'warning';
            case 'rejected':
                return 'error';
            default:
                return 'info';
        }
    };

    // Calculate pagination
    const startItem = quotesCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, quotesCount || 0);

    if (loading && quotes.length === 0) {
        return <Loader />;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">My RFQ's & Quotes</h2>
                <button 
                    onClick={handleNewRFQ}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer"
                >
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {quotes && quotes.length > 0 ? (
                            quotes.slice(0, itemsPerPage).map((quote) => (
                                <tr key={quote._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline hover:cursor-pointer"
                                        onClick={() => handleViewRFQ(quote)}>
                                        {`#${quote._id.slice(-6).toUpperCase()}`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(quote.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Chip 
                                            label={quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                            color={getStatusColor(quote.status)}
                                            size="small"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {quote.products.length} {quote.products.length === 1 ? 'item' : 'items'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {quote.file ? (
                                            <button 
                                                onClick={() => handleDownloadFile(quote.file)}
                                                className="text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                <DescriptionIcon fontSize="small" className="mr-1" />
                                                {quote.fileName || 'Download'}
                                            </button>
                                        ) : 'No file'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleViewRFQ(quote)}
                                            className="text-blue-600 hover:text-blue-900 hover:underline hover:cursor-pointer"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No RFQs found. Create your first RFQ to get started.
                                </td>
                            </tr>
                        )}
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
                        <div className="text-sm text-gray-700 px-4 py-2">
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
                                Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{quotesCount}</span> results
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
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" supportRole="img" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Dialog */}
            <Dialog
                open={showModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth={true}
                BackdropProps={{
                    style: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }}
                PaperProps={{
                    style: {
                        borderRadius: '12px',
                        padding: '16px'
                    }
                }}
            >
                <DialogContent>
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" component="h3">
                            RFQ Details: #{selectedRFQ?._id.slice(-6).toUpperCase()}
                        </Typography>
                        <IconButton 
                            aria-label="close"
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    
                    {/* Basic Info Section */}
                    <Box sx={{ mb: 4 }}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <Typography variant="body2" color="textSecondary">Status</Typography>
                                <Chip 
                                    label={selectedRFQ?.status?.charAt(0).toUpperCase() + selectedRFQ?.status?.slice(1)}
                                    color={getStatusColor(selectedRFQ?.status)}
                                    size="small"
                                />
                            </div>
                            <div>
                                <Typography variant="body2" color="textSecondary">Created Date</Typography>
                                <Typography variant="body1">{formatDate(selectedRFQ?.createdAt)}</Typography>
                            </div>
                            <div>
                                <Typography variant="body2" color="textSecondary">File</Typography>
                                {selectedRFQ?.file ? (
                                    <button 
                                        onClick={() => handleDownloadFile(selectedRFQ.file)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                        <CloudDownloadIcon fontSize="small" className="mr-1" />
                                        {selectedRFQ.fileName || 'Download File'}
                                    </button>
                                ) : (
                                    <Typography variant="body1">No file attached</Typography>
                                )}
                            </div>
                            <div>
                                <Typography variant="body2" color="textSecondary">File Type</Typography>
                                <Typography variant="body1">{selectedRFQ?.fileType || 'N/A'}</Typography>
                            </div>
                        </div>
                    </Box>
                    
                    {/* Products Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Products ({selectedRFQ?.products?.length || 0})
                        </Typography>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedRFQ?.products?.map((product, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {product.name || 'Unnamed Product'}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {product.quantity || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                    
                    {/* Comments Section */}
                    {selectedRFQ?.comments && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Comments
                            </Typography>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <Typography variant="body1">
                                    {selectedRFQ.comments}
                                </Typography>
                            </div>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RFQsAndQuotes;