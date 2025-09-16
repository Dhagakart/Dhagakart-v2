import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Truck, AlertCircle, Loader, Search, CheckCircle, Package, Download } from 'lucide-react';
import { getOrderShippingDetails } from '../../actions/orderAction';

// This component renders the visual tracking timeline
const TrackingTimeline = ({ trackingHistory }) => {
    const steps = [
        { label: 'Booked', statuses: ['BOOKED', 'DETAILS RECEIVED'], icon: <Package className="h-5 w-5" /> },
        { label: 'In Transit', statuses: ['IN-TRANSIT'], icon: <Truck className="h-5 w-5" /> },
        { label: 'Reached Hub', statuses: ['ARRIVED AT DESTINATION'], icon: <Package className="h-5 w-5" /> },
        { label: 'Out for Delivery', statuses: ['OUT FOR DELIVERY'], icon: <Truck className="h-5 w-5" /> },
        { label: 'Delivered', statuses: ['DELIVERED'], icon: <CheckCircle className="h-5 w-5" /> },
    ];

    const historyStatuses = trackingHistory.map(h => h.status.toUpperCase());
    let latestStepIndex = -1;

    steps.forEach((step, index) => {
        if (step.statuses.some(s => historyStatuses.includes(s))) {
            latestStepIndex = index;
        }
    });
    
    if (trackingHistory.length > 0 && latestStepIndex === -1) {
        latestStepIndex = 0;
    }
    
    const progressPercentage = latestStepIndex >= 0 ? (latestStepIndex / (steps.length - 1)) * 100 : 0;
    
    const getStepTimestamp = (step) => {
        const relevantHistory = trackingHistory.filter(h => step.statuses.includes(h.status.toUpperCase()));
        return relevantHistory.length > 0 ? relevantHistory[relevantHistory.length - 1] : null;
    }

    return (
        <div className="w-full px-2 sm:px-8 pt-4 pb-2">
            {/* Horizontal Timeline for larger screens */}
            <div className="relative hidden sm:block">
                <div className="absolute left-0 top-5 w-full h-1 bg-gray-200">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="relative flex justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = index <= latestStepIndex;
                        const timestamp = getStepTimestamp(step);
                        return (
                            <div key={step.label} className="flex flex-col items-center text-center w-20">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {step.icon}
                                </div>
                                <span className={`mt-2 text-xs font-medium whitespace-nowrap ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                                {isCompleted && timestamp && (
                                    <span className="mt-1 text-xs text-gray-400">
                                        {timestamp.date.split('-').slice(0, 2).reverse().join('/')}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vertical Timeline for mobile screens */}
            <div className="sm:hidden">
                <ul className="space-y-4">
                    {steps.map((step, index) => {
                        const isCompleted = index <= latestStepIndex;
                        const timestamp = getStepTimestamp(step);
                        return (
                            <li key={step.label} className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 flex-shrink-0 ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p className={`font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-500'}`}>{step.label}</p>
                                    {isCompleted && timestamp && (
                                        <p className="text-xs text-gray-400">
                                            {timestamp.date} at {timestamp.time}
                                        </p>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};


// This sub-component will render the results from your API
const TrackingResults = ({ data }) => {
    const { consignmentDetails, trackingHistory, lastUpdated } = data;
    const latestStatus = trackingHistory.length > 0 ? trackingHistory[trackingHistory.length - 1] : null;

    return (
        <div className="mt-6 space-y-8 animate-fade-in">
            <TrackingTimeline trackingHistory={trackingHistory} />

            {latestStatus && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">Latest Status</p>
                    <p className="text-lg font-bold text-blue-900">{latestStatus.status} at {latestStatus.location}</p>
                    <p className="text-xs text-blue-600">{latestStatus.date} - {latestStatus.time}</p>
                </div>
            )}

            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Consignment Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border border-gray-200 rounded-lg p-4">
                    {Object.entries(consignmentDetails).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="font-medium text-gray-900">{value || "N/A"}</p>
                        </div>
                    ))}
                </div>
            </div>

            {trackingHistory.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Tracking History</h4>
                    <div className="hidden sm:block border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr className="text-xs text-gray-500 text-left">
                                    <th className="px-4 py-2">Date & Time</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Location</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {trackingHistory.map((entry, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-4 py-3 text-sm text-gray-600">{entry.date}, {entry.time}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.status}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{entry.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="sm:hidden space-y-3">
                        {trackingHistory.map((entry, idx) => (
                            <div key={idx} className="p-3 border rounded-lg bg-gray-50 text-sm">
                                <p className="font-medium text-gray-900">{entry.status}</p>
                                <p className="text-gray-600">{entry.location}</p>
                                <p className="text-xs text-gray-400 mt-1">{entry.date}, {entry.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <p className="text-center text-xs text-gray-400">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
        </div>
    );
};

const TrackOrder = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [trackingIdInput, setTrackingIdInput] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { shippingDetails, loading: detailsLoading } = useSelector((state) => state.orderDetails);

    const handleTrackOrder = async (trackingId) => {
        if (!trackingId || !trackingId.trim()) {
            setError('Please enter a tracking ID.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTrackingData(null);
        try {
            const response = await fetch(`http://localhost:4000/api/v1/tracking/vrl/${trackingId}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Tracking failed');
            setTrackingData(data);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (orderId) {
            dispatch(getOrderShippingDetails(orderId));
        }
    }, [dispatch, orderId]);

    useEffect(() => {
        if (shippingDetails && shippingDetails.consignmentNumber) {
            setTrackingIdInput(shippingDetails.consignmentNumber);
        }
    }, [shippingDetails]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleTrackOrder(trackingIdInput);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 space-y-6 max-w-4xl mx-auto my-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4 sm:gap-2">
                <Link to="/account/orders" className="flex items-center text-gray-600 hover:text-gray-800 w-full sm:w-auto justify-center sm:justify-start">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Orders
                </Link>
                <h2 className="text-xl font-semibold text-gray-800 order-first sm:order-none">Order Details</h2>
                
                {/* --- FIX IS HERE --- */}
                {/* Conditionally render the link only if shippingDetails and the link itself exist */}
                {shippingDetails && shippingDetails.vrlInvoiceLink && (
                    <a 
                        href={shippingDetails.vrlInvoiceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end"
                    >
                        <Download className="h-4 w-4" />
                        Download Document
                    </a>
                )}
            </div>

            {/* Tracking Form */}
            <form onSubmit={onFormSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={trackingIdInput}
                        onChange={(e) => setTrackingIdInput(e.target.value.toUpperCase())}
                        placeholder="Enter VRL Tracking ID"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || detailsLoading}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading || detailsLoading ? (
                        <>
                            <Loader className="h-5 w-5 mr-2 animate-spin" />
                            <span>{isLoading ? 'Tracking...' : 'Loading...'}</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-5 w-5 mr-2" />
                            Track
                        </>
                    )}
                </button>
            </form>

            {/* Results, Loading, or Error State */}
            <div className="mt-6">
                {(isLoading || detailsLoading) && !trackingData && (
                    <div className="flex justify-center items-center text-gray-500 py-10">
                        <Loader className="h-6 w-6 mr-3 animate-spin" />
                        <span>Fetching latest tracking details...</span>
                    </div>
                )}
                {error && (
                    <div className="flex items-center p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="h-5 w-5 mr-3" />
                        <p>{error}</p>
                    </div>
                )}
                {trackingData && <TrackingResults data={trackingData} />}
            </div>
        </div>
    );
};

export default TrackOrder;