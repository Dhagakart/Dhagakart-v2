import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearErrors } from '../../actions/orderAction';
import { newSampleOrder } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

const SamplePayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { sampleCartItem, shippingInfo } = useSelector((state) => state.sampleCart || {});
    const { user } = useSelector((state) => state.user || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('cod');

    // Redirect if no sample item or shipping info
    useEffect(() => {
        if (!sampleCartItem) navigate('/sample/checkout');
        if (!shippingInfo) navigate('/sample/checkout');
    }, [sampleCartItem, shippingInfo, navigate]);

    const handlePayment = async () => {
        if (!sampleCartItem || !shippingInfo) return;
        
        setIsSubmitting(true);
        const orderData = {
            orderItems: [{
                product: sampleCartItem.product,
                name: sampleCartItem.name,
                price: sampleCartItem.price,
                image: sampleCartItem.image,
                quantity: 1,
                isSample: true
            }],
            shippingInfo: {
                ...shippingInfo,
                phoneNo: shippingInfo.phoneNumber,
                pinCode: shippingInfo.zipCode
            },
            paymentInfo: {
                id: `SAMPLE-${Date.now()}`,
                status: 'Not Paid',
                paymentMethod: 'Cash on Delivery'
            },
            itemsPrice: sampleCartItem.price,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: sampleCartItem.price,
            orderStatus: 'Processing',
            user: user._id
        };

        try {
            const result = await dispatch(newSampleOrder(orderData));
            if (result?.success) {
                enqueueSnackbar('Sample order placed successfully!', { variant: 'success' });
                dispatch({ type: 'REMOVE_FROM_SAMPLE_CART' });
                navigate('/order/success');
            }
        } catch (error) {
            enqueueSnackbar('Error placing sample order', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!sampleCartItem || !shippingInfo) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <MetaData title="Payment | Sample Order | DhagaKart" />
            <h1 className="text-2xl font-semibold mb-6">Payment</h1>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 border rounded-lg">
                                <input
                                    type="radio"
                                    id="cod"
                                    checked={selectedPayment === 'cod'}
                                    onChange={() => setSelectedPayment('cod')}
                                    className="h-5 w-5 text-blue-600"
                                />
                                <label htmlFor="cod" className="ml-3 block">
                                    <span className="block font-medium">Cash on Delivery</span>
                                    <span className="text-sm text-gray-500">Pay when you receive your order</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <button
                                onClick={handlePayment}
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="md:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatPrice(sampleCartItem.price)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-200 font-medium">
                                <div className="flex justify-between">
                                    <span>Total</span>
                                    <span>{formatPrice(sampleCartItem.price)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SamplePayment;