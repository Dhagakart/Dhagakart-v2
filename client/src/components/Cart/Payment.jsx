import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import { post } from '../../utils/paytmForm';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

import Paytm from './paytm.png';
import Gpay from './gpay.png';
import Phonepe from './phonepe.png';
import Netbanking from './netbanking.png';
import UPI from './upi.png';
import CreditCard from './creditcard.png';
import COD from './cod.png';

const Payment = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [payDisable, setPayDisable] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [selectedUpiApp, setSelectedUpiApp] = useState('');
    const [upiId, setUpiId] = useState('');

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const paymentData = {
        amount: Math.round(totalPrice),
        email: user.email,
        phoneNo: shippingInfo.phoneNo,
    };

    const handleVerifyAndPay = () => {
        window.location.href = '/orders/success';
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setPayDisable(true);

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const { data } = await axios.post(
                'http://localhost:5173/api/v1/payment/process',
                paymentData,
                config,
            );

            let info = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: data.paytmParams
            };

            post(info);
        } catch (error) {
            setPayDisable(false);
            enqueueSnackbar(error, { variant: "error" });
        }
    };

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
        <div className="bg-white rounded-lg shadow-sm min-w-[500px] p-6 border border-gray-100">
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
            {/* <button
                className={`w-full text-white py-3 rounded-md transition-colors duration-200 mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer bg-blue-600 hover:bg-blue-700`}
            >
                Proceed to Payment
            </button> */}
        </div>
    );

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="DhagaKart: Secure Payment | Paytm" />
            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-10 sm:mt-4 m-auto sm:mb-7">
                    {/* Payment Methods Section */}
                    <div className='md:w-2/3 border border-gray-200 p-6 rounded-lg shadow-lg'>
                        <h2 className="text-xl font-semibold mb-5 text-gray-800">Select Payment Method</h2>
                        <div className='w-full flex flex-col md:flex-row gap-4'>
                            {/* Left side - Payment options */}
                            <div className='w-full md:w-1/3 space-y-[1px] h-auto bg-gray-50 rounded-lg overflow-hidden border border-gray-200'>
                                {/* Net Banking */}
                                <div 
                                    className={`p-3 cursor-pointer ${selectedPayment === 'netBanking' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    onClick={() => setSelectedPayment('netBanking')}
                                >
                                    <div className='flex items-center'>
                                        <div className='w-8 h-8 flex items-center justify-center mr-3'>
                                            <img src={Netbanking} alt="Net Banking" className='h-6 w-6' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium'>Net Banking</p>
                                            <p className='text-xs text-gray-500'>Select from a list of banks</p>
                                        </div>
                                    </div>
                                </div>

                                {/* UPI */}
                                <div 
                                    className={`p-3 cursor-pointer ${selectedPayment === 'upi' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    onClick={() => setSelectedPayment('upi')}
                                >
                                    <div className='flex items-center'>
                                        <div className='w-8 h-8 flex items-center justify-center mr-3'>
                                            <img src={UPI} alt="UPI" className='h-6 w-6' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium'>UPI</p>
                                            <p className='text-xs text-gray-500'>Pay using UPI</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Credit & Debit Card */}
                                <div 
                                    className={`p-3 cursor-pointer ${selectedPayment === 'card' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    onClick={() => setSelectedPayment('card')}
                                >
                                    <div className='flex items-center'>
                                        <div className='w-8 h-8 flex items-center justify-center mr-3'>
                                            <img src={CreditCard} alt="Cards" className='h-6 w-6' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium'>Credit & Debit Card</p>
                                            <p className='text-xs text-gray-500'>Pay via Cards</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pay on Delivery */}
                                <div 
                                    className={`p-3 cursor-pointer ${selectedPayment === 'cod' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    onClick={() => setSelectedPayment('cod')}
                                >
                                    <div className='flex items-center'>
                                        <div className='w-8 h-8 flex items-center justify-center mr-3'>
                                            <img src={COD} alt="Cash on Delivery" className='h-6 w-6' />
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium'>Pay on Delivery</p>
                                            <p className='text-xs text-gray-500'>Pay cash on delivery</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Selected payment details */}
                            <div className='w-full md:w-2/3 bg-white p-6 rounded-lg border border-gray-200'>
                                {selectedPayment === 'upi' && (
                                    <div>
                                        <h3 className='text-lg font-medium mb-4'>Pay via UPI</h3>
                                        <p className='text-sm text-gray-600 mb-4'>Choose an app to make the payment</p>
                                        
                                        {/* UPI Apps */}
                                        <div className='grid grid-cols-3 gap-3 mb-6'>
                                            {[
                                                { id: 'paytm', name: 'Paytm UPI', icon: Paytm },
                                                { id: 'gpay', name: 'Google Pay', icon: Gpay },
                                                { id: 'phonepe', name: 'PhonePe UPI', icon: Phonepe }
                                            ].map(app => (
                                                <div 
                                                    key={app.id}
                                                    className={`border rounded-md p-3 text-center cursor-pointer ${selectedUpiApp === app.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                    onClick={() => setSelectedUpiApp(app.id)}
                                                >
                                                    <div className='flex flex-col items-center'>
                                                        <img 
                                                            src={app.icon} 
                                                            alt={app.name}
                                                            className='h-10 w-10 object-contain mb-2'
                                                        />
                                                        <span className='text-xs'>{app.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* UPI ID Input */}
                                        <div className='mb-6'>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>Enter UPI ID</label>
                                            <input
                                                type='text'
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder='yourname@upi'
                                                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                                            />
                                            <p className='text-xs text-gray-500 mt-1'>A payment request will be sent to this UPI ID</p>
                                        </div>

                                        <button 
                                            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-sm h-10 flex items-center justify-center hover:cursor-pointer'
                                            // disabled={!upiId}
                                            onClick={handleVerifyAndPay}
                                        >
                                            Verify & Pay
                                        </button>
                                    </div>
                                )}
                                
                                {/* Other payment methods can be added here similarly */}
                                {selectedPayment !== 'upi' && (
                                    <div className='flex items-center justify-center h-64 text-gray-500'>
                                        Select a payment method to continue
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {renderPriceSidebar()}
                </div>
            </main>
        </>
    );
};

export default Payment;