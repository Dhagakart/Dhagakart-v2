import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import MetaData from '../Layouts/MetaData';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { formatPrice } from '../../utils/formatPrice';

const Cart = () => {

    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { saveForLaterItems } = useSelector((state) => state.saveForLater);
    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const placeOrderHandler = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/shipping');
    }

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

    const renderPriceSidebar = () => (
        <div className='space-y-5'>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-5 text-gray-800">Order Summary</h2>
                <div className="space-y-4">
                    <PriceRow label="Sub-total" value={formatPrice(subtotal)} />
                    <PriceRow label="Shipping" value="Free" isDiscount />
                    <PriceRow label="Discount" value={`-${formatPrice(discount)}`} isDiscount />
                    <PriceRow label="Tax (10%)" value={formatPrice(tax)} />
                    <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
                </div>
                <button
                    onClick={placeOrderHandler}
                    disabled={cartItems.length === 0 || !isAuthenticated}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-200 mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer ${
                        cartItems.length === 0 || !isAuthenticated ? 'opacity-50' : ''
                    }`}
                >
                    {cartItems.length === 0 || !isAuthenticated ? 'Login to Checkout' : 'Proceed to Checkout'}
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-base font-medium mb-3 text-gray-700">Apply Coupon</h3>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-md transition-colors duration-200 text-sm font-medium">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <MetaData title="Shopping Cart | DhagaKart" />
            <main className="w-full min-h-[90vh] flex justify-center items-center px-12 mt-10">
                <div className="container mx-auto py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-semibold p-6">Shopping Cart</h2>
                                 
                                {cartItems.length === 0 ? (
                                    <EmptyCart />
                                ) : (
                                    <div>
                                        {/* Cart items table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className='bg-[#F2F4F5]'>
                                                    <tr className="text-left">
                                                        <th className="py-3 pl-6 font-medium text-gray-600 w-2/5">PRODUCTS</th>
                                                        <th className="py-3 pl-6 font-medium text-gray-600 text-center">PRICE</th>
                                                        <th className="py-3 pl-6 font-medium text-gray-600 text-center">QUANTITY</th>
                                                        <th className="py-3 pr-6 font-medium text-gray-600 text-right">SUB-TOTAL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cartItems.map((item) => (
                                                        <CartItem key={item.product} {...item} inCart={true} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="my-6 pl-6 flex justify-between">
                                            <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 p-2 border-2 border-blue-600 rounded-lg">
                                                <FaArrowLeft className="mr-2" /> Return to Shop
                                            </Link>
                                            {/* <button 
                                                onClick={placeOrderHandler} 
                                                disabled={cartItems.length < 1}
                                                className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center ${cartItems.length < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                Proceed to Checkout <FaArrowRight className="ml-2" />
                                            </button> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="lg:w-1/3">
                            {renderPriceSidebar()}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Cart;
