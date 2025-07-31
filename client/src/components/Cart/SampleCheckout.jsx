import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveSampleShippingInfo, clearErrors } from '../../actions/cartAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';
import axios from 'axios';

const SampleCheckout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Access the sample cart state with proper default values
    const { sampleCartItem } = useSelector((state) => state.sampleCart || { sampleCartItem: null });
    const { user } = useSelector((state) => state.user || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        phoneNumber: user?.phone || '',
        email: user?.email || ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Save shipping info to Redux
            dispatch(saveSampleShippingInfo(formData));
            
            // Navigate to sample payment
            navigate('/sample/payment');
        } catch (error) {
            console.error('Error saving shipping info:', error);
            enqueueSnackbar('Error saving shipping information', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check for sample item and redirect if needed
    useEffect(() => {
        const checkSampleItem = () => {
            if (!sampleCartItem) {
                enqueueSnackbar('No sample item in cart', { variant: 'warning' });
                navigate('/');
                return false;
            }
            setIsLoading(false);
            return true;
        };

        // Add a small delay to ensure state is properly loaded
        const timer = setTimeout(() => {
            checkSampleItem();
        }, 100);

        return () => clearTimeout(timer);
    }, [sampleCartItem, navigate, enqueueSnackbar]);

    // Show loading state while checking for sample item
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your sample order...</p>
                </div>
            </div>
        );
    }

    if (!sampleCartItem) {
        return null;
    }

    const { name, price, image } = sampleCartItem;

    return (
        <>
            <MetaData title="Sample Checkout | DhagaKart" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Sample Order Checkout</h1>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Shipping Information</h2>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Shipping Form */}
                                <div className="md:w-2/3">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    State *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    ZIP Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Order Summary */}
                                <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-800 mb-4">Order Summary</h3>
                                    
                                    <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-gray-200">
                                        <div className="w-20 h-20 bg-white border border-gray-200 rounded-md overflow-hidden">
                                            <img 
                                                src={image} 
                                                alt={name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-800">{name}</h4>
                                            <p className="text-sm text-gray-500">Sample Product</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {formatPrice(price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">{formatPrice(price)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">FREE</span>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-gray-200 text-base font-medium">
                                            <div className="flex justify-between">
                                                <span>Total</span>
                                                <span>{formatPrice(price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SampleCheckout;
