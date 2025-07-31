import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import { formatPrice } from '../../utils/formatPrice';

// --- MODIFICATION: Import all necessary actions ---
import { newOrder, createSampleOrder, clearErrors } from '../../actions/orderAction';
import { emptyCart, emptySampleCart } from '../../actions/cartAction';

import COD from './cod.png';
import { FaCreditCard } from 'react-icons/fa'; // Using an icon as a placeholder

const Payment = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [payDisable, setPayDisable] = useState(false);
    // --- UI RESTORED: Your original view state is back ---
    const [view, setView] = useState('payment'); 

    // --- LOGIC UPDATE: Get data from BOTH carts ---
    const { user } = useSelector((state) => state.user);
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { sampleShippingInfo, sampleCartItems } = useSelector((state) => state.sampleCart);
    const { error: orderError } = useSelector((state) => state.newOrder);

    // --- LOGIC UPDATE: Automatically set the correct view on page load ---
    useEffect(() => {
        if (sampleCartItems.length > 0) {
            setView('sample');
        } else {
            setView('payment');
        }
    }, [cartItems.length, sampleCartItems.length]);

    // --- LOGIC UPDATE: Determine which cart's data to use based on the selected tab ---
    const activeCartItems = view === 'sample' ? sampleCartItems : cartItems;
    const activeShippingInfo = view === 'sample' ? sampleShippingInfo : shippingInfo;

    const calculateCartTotals = (items) => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const sgst = subtotal * 0.05;
        const cgst = subtotal * 0.05;
        const totalGst = sgst + cgst;
        const shippingCharges = subtotal > 500 ? 0 : 100;
        const finalTotal = subtotal + totalGst + shippingCharges;
        return { subtotal, sgst, cgst, totalGst, shippingCharges, finalTotal };
    };

    // This calculation is now dynamic based on the active tab
    const { subtotal, sgst, cgst, totalGst, shippingCharges, finalTotal } = calculateCartTotals(activeCartItems);

    // This function remains for regular orders
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

        dispatch(newOrder(order));
        dispatch(emptyCart());
        navigate("/orders/success");
        setPayDisable(false);
    };
    
    // --- LOGIC UPDATE: This function now handles sample order payment ---
    const handleSampleOrderPayment = () => {
        setPayDisable(true);
        const order = {
            shippingInfo: sampleShippingInfo,
            orderItems: sampleCartItems,
            paymentInfo: { id: `SAMPLE_PAYMENT-${Date.now()}`, status: "succeeded" },
            itemsPrice: subtotal,
            taxPrice: totalGst,
            shippingPrice: shippingCharges,
            totalPrice: finalTotal,
        };

        dispatch(createSampleOrder(order));
        dispatch(emptySampleCart());
        navigate("/orders/success"); // Consider a different success page for samples
        setPayDisable(false);
    };

    const PriceRow = ({ label, value, isTotal = false }) => (
        <div className={`flex justify-between ${isTotal ? 'pt-3 mt-3 border-t border-gray-200' : ''}`}>
            <span className={`${isTotal ? 'font-semibold' : 'text-gray-600'} text-base`}>{label}</span>
            <span className={`${isTotal ? 'text-lg font-semibold' : 'font-medium text-base'}`}>{value}</span>
        </div>
    );

    const renderPriceSidebar = () => (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-5 text-gray-800">
                {view === 'sample' ? 'Sample Order Summary' : 'Order Summary'}
            </h2>
            <div className="space-y-4 pt-4">
                <PriceRow label={`Sub-total (${activeCartItems.length} items)`} value={formatPrice(subtotal)} />
                {/* <PriceRow label="GST (10%)" value={formatPrice(totalGst)} /> */}
                <PriceRow label="SGST (5%)" value={formatPrice(sgst)} />
                <PriceRow label="CGST (5%)" value={formatPrice(cgst)} />
                <PriceRow label="Shipping Charges" value={formatPrice(shippingCharges)} />
                <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
            </div>
        </div>
    );
    
    // --- UI RESTORED: Your original component for the sample form ---
    const renderSampleRequestForm = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">Pay for Sample</h2>
            <p className="text-sm text-gray-600 mb-6">
                A nominal fee is charged for sample delivery. Complete the payment to confirm your sample order.
            </p>
             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="h-9 w-9 text-blue-500" />
            </div>
            <button
                onClick={handleSampleOrderPayment}
                disabled={payDisable}
                className={`w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors text-base h-12 flex items-center justify-center ${payDisable ? 'opacity-50' : 'hover:bg-blue-700 active:bg-blue-800 hover:cursor-pointer'}`}
            >
                {payDisable ? 'Processing...' : `Pay ${formatPrice(finalTotal)} for Sample`}
            </button>
        </div>
    );

    // --- UI RESTORED: Your original component for the COD section ---
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
                            {/* --- UI RESTORED: Your original tabs are back, now with disabled logic --- */}
                            <div className="flex border-b border-gray-200 mb-4">
                                <button
                                    onClick={() => setView('payment')}
                                    disabled={sampleCartItems.length > 0} // Disable if sample cart has items
                                    className={`py-3 px-6 font-medium text-center ${view === 'payment' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'} ${sampleCartItems.length > 0 ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700 hover:cursor-pointer'}`}
                                >
                                    Place Order
                                </button>
                                <button
                                    onClick={() => setView('sample')}
                                    disabled={cartItems.length > 0} // Disable if regular cart has items
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