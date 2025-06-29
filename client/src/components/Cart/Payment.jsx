import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, newOrder } from '../../actions/orderAction';
import { useSnackbar } from 'notistack';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';
import { useNavigate } from 'react-router-dom';
import { emptyCart } from '../../actions/cartAction';

import Paytm from './paytm.png';
import Gpay from './gpay.png';
import Phonepe from './phonepe.png';
import Netbanking from './netbanking.png';
import UPI from './UPI.png';
import CreditCard from './creditcard.png';
import COD from './cod.png';

const Payment = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [payDisable, setPayDisable] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiIdError, setUpiIdError] = useState('');

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error: orderError } = useSelector((state) => state.newOrder);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const paymentData = {
    amount: Math.round(totalPrice),
    email: user.email,
    phoneNo: shippingInfo.phoneNo,
    orderId: `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId: user._id,
    upiId: upiId,
  };

  const validateUpiId = (id) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!id) {
      setUpiIdError('UPI ID is required');
      return false;
    } else if (!upiRegex.test(id)) {
      setUpiIdError('Invalid UPI ID format (e.g., yourname@upi)');
      return false;
    }
    setUpiIdError('');
    return true;
  };

  const handleUpiPayment = async (appId) => {
    if (!validateUpiId(upiId)) return;
  
    setPayDisable(true);
    setError('');
  
    try {
      // Calculate cart totals
      const { total, tax, finalTotal } = calculateCartTotals();
      
      // Prepare order data
      const orderData = {
        itemsPrice: total,
        taxPrice: tax,
        shippingPrice: 0, // Assuming free shipping
        totalPrice: finalTotal,
        paymentInfo: {
          id: `mock_pay_${Date.now()}`,
          status: 'succeeded',
          paymentMethod: `UPI (${appId})`
        },
        paidAt: new Date().toISOString(),
        orderStatus: 'Processing',
        createdAt: new Date().toISOString()
      };

      // Submit the order
      const result = await dispatch(newOrder(orderData));
      
      if (result?.success) {
        // Clear cart after successful order
        await dispatch(emptyCart());
        // Redirect to order success page
        navigate('/orders/success');
      } else {
        throw new Error('Failed to place order');
      }
  
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
    } finally {
      setPayDisable(false);
    }
  };

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
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
      {/* <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <CartItemCard key={item.product} item={item} />
        ))}
      </div> */}
      <div className="space-y-4 pt-4">
        <PriceRow label="Sub-total" value={formatPrice(subtotal)} />
        <PriceRow label="Shipping" value="Free" isDiscount />
        <PriceRow label="Discount" value={`-${formatPrice(discount)}`} isDiscount />
        <PriceRow label="Tax (10%)" value={formatPrice(tax)} />
        <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
      </div>
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
      <MetaData title="DhagaKart: Secure Payment" />
      <main className="w-full min-h-[91vh] px-4 sm:px-6 mt-10 lg:px-16 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[500px] flex flex-col">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Select Payment Method</h2>
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3 space-y-2 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <div
                      className={`p-3 cursor-pointer ${selectedPayment === 'upi' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => setSelectedPayment('upi')}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3">
                          <img src={UPI} alt="UPI" className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">UPI</p>
                          <p className="text-xs text-gray-500">Pay using UPI</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-3 cursor-pointer ${selectedPayment === 'card' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => setSelectedPayment('card')}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3">
                          <img src={CreditCard} alt="Cards" className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Credit/Debit Card</p>
                          <p className="text-xs text-gray-500">Pay via Cards</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-3 cursor-pointer ${selectedPayment === 'cod' ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => setSelectedPayment('cod')}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center mr-3">
                          <img src={COD} alt="Cash on Delivery" className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Cash on Delivery</p>
                          <p className="text-xs text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3 bg-white p-6 rounded-lg border border-gray-200">
                    {selectedPayment === 'upi' ? (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Pay via UPI</h3>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Enter UPI ID</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              validateUpiId(e.target.value);
                            }}
                            placeholder="yourname@upi"
                            className={`w-full p-2 border ${upiIdError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                          />
                          {upiIdError && <p className="text-xs text-red-500 mt-1">{upiIdError}</p>}
                          <p className="text-xs text-gray-500 mt-1">A payment request will be sent to this UPI ID</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Optionally, choose a UPI app to pay</p>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {[
                            { id: 'paytm', name: 'Paytm UPI', icon: Paytm },
                            { id: 'gpay', name: 'Google Pay', icon: Gpay },
                            { id: 'phonepe', name: 'PhonePe UPI', icon: Phonepe },
                          ].map((app) => (
                            <div
                              key={app.id}
                              className={`border rounded-md p-3 text-center cursor-pointer ${selectedUpiApp === app.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => setSelectedUpiApp(app.id)}
                            >
                              <div className="flex flex-col items-center">
                                <img src={app.icon} alt={app.name} className="h-10 w-10 object-contain mb-2" />
                                <span className="text-xs">{app.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className={`w-full bg-[#003366] text-white py-2 px-4 rounded-md font-medium transition-colors text-sm h-10 flex items-center justify-center hover:cursor-pointer ${payDisable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00264d]'}`}
                          disabled={payDisable}
                          onClick={() => handleUpiPayment(selectedUpiApp)}
                        >
                          {payDisable ? 'Placing Order...' : 'Place Order'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        Select a payment method to continue
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              {renderPriceSidebar()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Payment;