import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';
import { newOrder, createSampleOrder, clearErrors } from '../../actions/orderAction';
import { emptyCart, emptySampleCart } from '../../actions/cartAction';
import api from '../../utils/api';
import useRazorpay from '../../hooks/useRazorpay'; 

import COD from './cod.png';
import { FaCreditCard } from 'react-icons/fa';

const Payment = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const isRazorpayLoaded = useRazorpay();
    const [payDisable, setPayDisable] = useState(false);
    const [view, setView] = useState('payment'); 
    const [razorpayApiKey, setRazorpayApiKey] = useState('');

    const { user } = useSelector((state) => state.user);
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { sampleShippingInfo, sampleCartItems } = useSelector((state) => state.sampleCart);
    const { error: orderError } = useSelector((state) => state.newOrder);

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const { data } = await api.get('/payment/razorpay/apikey');
                setRazorpayApiKey(data.razorpayApiKey);
            } catch (error) {
                enqueueSnackbar("Could not fetch payment API key.", { variant: "error" });
            }
        };
        fetchApiKey();
    }, []);

    useEffect(() => {
        if (sampleCartItems.length > 0) {
            setView('sample');
        } else {
            setView('payment');
        }
    }, [cartItems.length, sampleCartItems.length]);

    const activeCartItems = view === 'sample' ? sampleCartItems : cartItems;
    const activeShippingInfo = view === 'sample' ? sampleShippingInfo : shippingInfo;

    const calculateCartTotals = (items) => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const sgst = subtotal * 0.05;
        const cgst = subtotal * 0.05;
        const totalGst = sgst + cgst;
        const shippingCharges = subtotal > 500 ? 0 : 100;
        const finalTotal = subtotal + totalGst + shippingCharges;
        return { subtotal, totalGst, shippingCharges, finalTotal };
    };

    const { subtotal, totalGst, shippingCharges, finalTotal } = calculateCartTotals(activeCartItems);

    const handleCodOrder = async () => {
        setPayDisable(true);
        const order = {
            shippingInfo,
            orderItems: cartItems,
            paymentInfo: { id: `COD-${Date.now()}`, status: "Processing" },
            itemsPrice: subtotal,
            taxPrice: totalGst,
            shippingPrice: shippingCharges,
            totalPrice: finalTotal,
        };

        try {
            await dispatch(newOrder(order));
            dispatch(emptyCart());
            navigate("/orders/success");
        } catch (error) {
            enqueueSnackbar(error.message || "Failed to place order", { variant: "error" });
        } finally {
            setPayDisable(false);
        }
    };
    
    const handleSampleOrderPayment = async () => {
        if (!isRazorpayLoaded || !razorpayApiKey) {
            enqueueSnackbar("Payment gateway is not ready. Please try again.", { variant: "warning" });
            return;
        }
        setPayDisable(true);

        try {
            const { data } = await api.post('/payment/razorpay/sample', { amount: finalTotal });

            const options = {
                key: razorpayApiKey,
                amount: data.order.amount,
                currency: "INR",
                name: "DhagaKart Samples",
                description: "Payment for Sample Order",
                order_id: data.order.id,
                handler: function (response) {
                    const order = {
                        shippingInfo: sampleShippingInfo,
                        orderItems: sampleCartItems,
                        paymentInfo: { id: response.razorpay_payment_id, status: "succeeded" },
                        itemsPrice: subtotal,
                        taxPrice: totalGst,
                        shippingPrice: shippingCharges,
                        totalPrice: finalTotal,
                    };
                    dispatch(createSampleOrder(order));
                    dispatch(emptySampleCart());
                    navigate("/orders/success");
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: activeShippingInfo.phoneNo,
                },
                theme: { color: "#003366" },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                enqueueSnackbar(response.error.description, { variant: "error" });
            });
            rzp1.open();
        } catch (error) {
            enqueueSnackbar("Payment processing failed. Please try again.", { variant: "error" });
        } finally {
            setPayDisable(false);
        }
    };

    const PriceRow = ({ label, value, isTotal = false }) => (
        <div className={`flex justify-between items-center ${isTotal ? 'pt-4 mt-4 border-t border-gray-200' : ''}`}>
            <p className={`${isTotal ? 'font-semibold' : 'text-gray-600'} text-base`}>{label}</p>
            <p className={`${isTotal ? 'text-lg font-bold' : 'text-base font-semibold'}`}>{value}</p>
        </div>
    );

    const renderPriceSidebar = () => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                {view === 'sample' ? 'Sample Order Summary' : 'Order Summary'}
            </h2>
            <div className="space-y-3">
                <PriceRow label={`Subtotal (${activeCartItems.length} items)`} value={formatPrice(subtotal)} />
                <PriceRow label="GST (10%)" value={formatPrice(totalGst)} />
                <PriceRow label="Shipping Charges" value={formatPrice(shippingCharges)} />
                <PriceRow label="Total Amount" value={formatPrice(finalTotal)} isTotal />
            </div>
        </div>
    );
    
    const renderSampleRequestForm = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="h-9 w-9 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Pay for Sample</h2>
            <p className="text-gray-600 mb-6 max-w-sm">
                A nominal fee is charged for sample delivery. Complete the payment to confirm your sample order.
            </p>
            <button
                onClick={handleSampleOrderPayment}
                disabled={payDisable || !isRazorpayLoaded}
                className={`w-full max-w-xs bg-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors text-base h-12 flex items-center justify-center ${(payDisable || !isRazorpayLoaded) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:bg-blue-800 hover:cursor-pointer'}`}
            >
                {payDisable ? 'Processing...' : `Pay ${formatPrice(finalTotal)} for Sample`}
            </button>
        </div>
    );

    const renderPaymentSection = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src={COD} alt="Cash on Delivery" className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Cash on Delivery</h3>
            <p className="text-gray-600 mb-6 max-w-sm">You can pay in cash to our courier when you receive the goods at your doorstep.</p>
            <button
                type="button"
                className={`w-full max-w-xs bg-[#003366] text-white py-3 px-4 rounded-md font-medium transition-colors text-base h-12 flex items-center justify-center ${payDisable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00264d] active:bg-[#001a33] hover:cursor-pointer'}`}
                disabled={payDisable}
                onClick={handleCodOrder}
            >
                {payDisable ? 'Placing Order...' : `Place Order & Pay ${formatPrice(finalTotal)}`}
            </button>
        </div>
    );

    useEffect(() => {
        if (orderError) {
            enqueueSnackbar(orderError, { variant: "error" });
            dispatch(clearErrors());
        }
    }, [dispatch, orderError, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Secure Payment" />
            <main className="w-full min-h-[91vh] px-3 sm:px-4 md:px-6 mt-10 lg:px-16 py-4 sm:py-6 md:py-8">
                <div className="container mx-auto">
                    <div className="block md:hidden mb-4">
                        {renderPriceSidebar()}
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        <div className="w-full lg:w-2/3">
                            <div className="flex border-b border-gray-200 mb-4">
                                <button
                                    onClick={() => setView('payment')}
                                    disabled={sampleCartItems.length > 0}
                                    className={`py-3 px-6 font-medium text-center ${view === 'payment' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'} ${sampleCartItems.length > 0 ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700 hover:cursor-pointer'}`}
                                >
                                    Place Order
                                </button>
                                <button
                                    onClick={() => setView('sample')}
                                    disabled={cartItems.length > 0}
                                    className={`py-3 px-6 font-medium text-center ${view === 'sample' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'} ${cartItems.length > 0 ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700 hover:cursor-pointer'}`}
                                >
                                    Request Sample
                                </button>
                            </div>
                            {view === 'payment' ? renderPaymentSection() : renderSampleRequestForm()}
                        </div>
                        <div className="hidden lg:block lg:w-1/3">
                             <div className="lg:sticky lg:top-24">
                                {renderPriceSidebar()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Payment;
