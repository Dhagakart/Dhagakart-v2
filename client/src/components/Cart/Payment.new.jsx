import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stepper from './Stepper';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import { post } from '../../utils/paytmForm';
import { formatPrice } from '../../utils/formatPrice';
import MetaData from '../Layouts/MetaData';

const Payment = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [payDisable, setPayDisable] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [selectedUpi, setSelectedUpi] = useState('paytm');
    const [upiId, setUpiId] = useState('');

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    // Calculate cart totals
    const calculateCartTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity), 0);
        const discount = cartItems.reduce((sum, item) => sum + ((item.cuttedPrice * item.quantity) - (item.price * item.quantity)), 0);
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = total * 0.1; // 10% tax
        const finalTotal = total + tax;
        return { subtotal, discount, total, tax, finalTotal };
    };

    const { subtotal, discount, total, tax, finalTotal } = calculateCartTotals();

    const PriceRow = ({ label, value, isDiscount = false, isTotal = false }) => (
        <div className={`flex justify-between ${isTotal ? 'pt-3 mt-3 border-t border-gray-200' : ''}`}>
            <span className={`${isTotal ? 'font-semibold' : 'text-gray-600'} ${isTotal ? 'text-lg' : 'text-base'}`}>
                {label}
            </span>
            <span className={`${isDiscount ? 'text-green-600' : 'font-medium'} ${isTotal ? 'text-lg font-semibold' : 'text-base'}`}>
                {value}
            </span>
        </div>
    );

    const CartItemCard = ({ item }) => (
        <div className="flex items-start gap-3 pb-3">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">
                        {item.quantity} × <span className="font-medium text-blue-800">{formatPrice(item.price)}</span>
                    </span>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
            </div>
        </div>
    );

    const renderPriceSidebar = () => (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">Order Summary</h2>

            {/* Cart Items List */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                    <CartItemCard key={item.product} item={item} />
                ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 pt-4">
                <PriceRow label="Sub-total" value={formatPrice(subtotal)} />
                <PriceRow label="Shipping" value="Free" isDiscount />
                <PriceRow label="Discount" value={`-${formatPrice(discount)}`} isDiscount />
                <PriceRow label="Tax (10%)" value={formatPrice(tax)} />
                <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
            </div>
            <button
                onClick={handleProceedToPayment}
                disabled={payDisable}
                className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium ${
                    payDisable 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {payDisable ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
            </button>
        </div>
    );

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        setPayDisable(true);
        
        try {
            // Your payment processing logic here
            const paymentData = {
                amount: Math.round(finalTotal),
                email: user.email,
                phoneNo: shippingInfo.phoneNo,
                paymentMethod,
                upiId: paymentMethod === 'upi' ? upiId : undefined
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                'https://dhagakart.onrender.com/api/v1/payment/process',
                paymentData,
                config,
            );

            // Handle successful payment
            if (data.success) {
                enqueueSnackbar('Payment successful!', { variant: 'success' });
                // Redirect to success page or next step
            }

        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Payment failed', { variant: 'error' });
            setPayDisable(false);
        }
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Payment | DhagaKart" />
            <main className="w-full min-h-[90vh] flex justify-center items-start px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-7xl mx-auto">
                    <Stepper activeStep={3} />
                    
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Payment Methods */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <h2 className="text-xl font-semibold mb-6 text-gray-800">Select Payment Method</h2>
                                
                                <form onSubmit={handleProceedToPayment} className="space-y-4">
                                    {/* Net Banking Option */}
                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                        <label className="flex items-start cursor-pointer">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    checked={paymentMethod === 'netbanking'}
                                                    onChange={() => setPaymentMethod('netbanking')}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <span className="font-medium text-gray-700">Net banking</span>
                                                <p className="text-gray-500 mt-1">All banks</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* UPI Option */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    checked={paymentMethod === 'upi'}
                                                    onChange={() => setPaymentMethod('upi')}
                                                />
                                                <span className="ml-3 text-sm font-medium text-gray-700">UPI</span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <img 
                                                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                                                    alt="Paytm" 
                                                    className="h-6 w-6 object-contain"
                                                />
                                                <img 
                                                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_8a170f.png" 
                                                    alt="Google Pay" 
                                                    className="h-6 w-6 object-contain"
                                                />
                                                <img 
                                                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_5c9215.png" 
                                                    alt="PhonePe" 
                                                    className="h-6 w-6 object-contain"
                                                />
                                            </div>
                                        </label>
                                        
                                        {paymentMethod === 'upi' && (
                                            <div className="px-4 pb-4">
                                                <div className="mt-4 space-y-3 pl-7">
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="upi"
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            checked={selectedUpi === 'paytm'}
                                                            onChange={() => setSelectedUpi('paytm')}
                                                        />
                                                        <span className="ml-3 text-sm text-gray-700">Paytm UPI</span>
                                                    </label>
                                                    
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="upi"
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            checked={selectedUpi === 'gpay'}
                                                            onChange={() => setSelectedUpi('gpay')}
                                                        />
                                                        <span className="ml-3 text-sm text-gray-700">Google Pay UPI</span>
                                                    </label>
                                                    
                                                    <label className="flex items-center cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="upi"
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            checked={selectedUpi === 'phonepe'}
                                                            onChange={() => setSelectedUpi('phonepe')}
                                                        />
                                                        <span className="ml-3 text-sm text-gray-700">PhonePe UPI</span>
                                                    </label>
                                                </div>
                                                
                                                <div className="mt-4 pl-7">
                                                    <label htmlFor="upi-id" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Enter UPI ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="upi-id"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                        placeholder="yourname@upi"
                                                        value={upiId}
                                                        onChange={(e) => setUpiId(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Verify & Pay
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Credit & Debit Card Option */}
                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                        <label className="flex items-start cursor-pointer">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={() => setPaymentMethod('card')}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <span className="font-medium text-gray-700">Credit & Debit Card</span>
                                                <div className="flex space-x-2 mt-2">
                                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/visa_5e4fa2.png" alt="Visa" className="h-6" />
                                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mastercard_3d4a40.png" alt="Mastercard" className="h-6" />
                                                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/rupay_8aace8.png" alt="RuPay" className="h-6" />
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Pay on Delivery Option */}
                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                                        <label className="flex items-start cursor-pointer">
                                            <div className="flex items-center h-5">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={() => setPaymentMethod('cod')}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <span className="font-medium text-gray-700">Pay on Delivery</span>
                                                <p className="text-gray-500 mt-1">Pay with cash, UPI or Card when you receive your order</p>
                                            </div>
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            {renderPriceSidebar()}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Payment;
