// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// import MetaData from '../Layouts/MetaData';
// import CartItem from './CartItem';
// import EmptyCart from './EmptyCart';
// import LoginModal from '../User/LoginModal';
// import { formatPrice } from '../../utils/formatPrice';

// const Cart = () => {
//     const [showLoginModal, setShowLoginModal] = useState(false);
//     const navigate = useNavigate();
//     const { cartItems } = useSelector((state) => state.cart);
//     const { saveForLaterItems } = useSelector((state) => state.saveForLater);
//     const { loading, isAuthenticated, error } = useSelector((state) => state.user);

//     const placeOrderHandler = () => {
//         if (!isAuthenticated) {
//             setShowLoginModal(true);
//             return;
//         }
//         navigate('/shipping');
//     }

//     // Calculate cart totals
//     const calculateCartTotals = () => {
//         const subtotal = cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity), 0);
//         const discount = cartItems.reduce((sum, item) => sum + ((item.cuttedPrice * item.quantity) - (item.price * item.quantity)), 0);
//         const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//         const tax = total * 0.1; // 10% tax
//         const finalTotal = total + tax;
//         return { subtotal, discount, total, tax, finalTotal };
//     };

//     const { subtotal, discount, total, tax, finalTotal } = calculateCartTotals();

//     const PriceRow = ({ label, value, isDiscount = false, isTotal = false }) => (
//         <div className={`flex justify-between ${isTotal ? 'pt-3 mt-3 border-t border-gray-200' : ''}`}>
//             <span className={`${isTotal ? 'font-semibold' : 'text-gray-600'} ${isTotal ? 'text-lg' : 'text-base'}`}>
//                 {label}
//             </span>
//             <span className={`${isDiscount ? 'text-green-600' : 'font-medium'} ${isTotal ? 'text-lg font-semibold' : 'text-base'}`}>
//                 {value}
//             </span>
//         </div>
//     );

//     const renderPriceSidebar = () => (
//         <div className='space-y-5'>
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <h2 className="text-xl font-semibold mb-5 text-gray-800">Order Summary</h2>
//                 <div className="space-y-4">
//                     <PriceRow label="Sub-total" value={formatPrice(subtotal)} />
//                     <PriceRow label="Shipping" value="Free" isDiscount />
//                     <PriceRow label="Discount" value={`-${formatPrice(discount)}`} isDiscount />
//                     <PriceRow label="Tax (10%)" value={formatPrice(tax)} />
//                     <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
//                 </div>
//                 <button
//                     onClick={placeOrderHandler}
//                     disabled={cartItems.length === 0}
//                     className={`w-full bg-[#003366] hover:bg-[#003366] text-white py-3 rounded-md transition-colors duration-200 mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer ${
//                         cartItems.length === 0 ? 'opacity-50' : ''
//                     }`}
//                 >
//                     {cartItems.length === 0 ? 'Your cart is empty' : isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
//                 </button>
//             </div>
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <h3 className="text-base font-medium mb-3 text-gray-700">Apply Coupon</h3>
//                 <div className="flex">
//                     <input
//                         type="text"
//                         placeholder="Enter coupon code"
//                         className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                     <button className="bg-[#003366] hover:bg-[#003366] text-white px-4 py-2 rounded-r-md transition-colors duration-200 text-sm font-medium hover:cursor-pointer">
//                         Apply
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             <MetaData title="Shopping Cart | DhagaKart" />
//             <main className="w-full min-h-[91vh] px-12 mt-10">
//                 <div className="container mx-auto py-8">
//                     <div className="flex flex-col md:flex-row gap-4">
//                         {/* Left Column - Cart Items */}
//                         <div className="md:w-2/3">
//                             <div className="bg-white rounded-lg shadow-md border border-gray-200">
//                                 <h2 className="text-xl font-semibold p-6">Shopping Cart</h2>
                                 
//                                 {cartItems.length === 0 ? (
//                                     <EmptyCart />
//                                 ) : (
//                                     <div>
//                                         {/* Cart items table */}
//                                         <div className="overflow-x-auto">
//                                             <table className="w-full">
//                                                 <thead className='bg-[#F2F4F5]'>
//                                                     <tr className="text-left">
//                                                         <th className="py-3 pl-6 font-medium text-gray-600 w-2/5">PRODUCTS</th>
//                                                         <th className="py-3 pl-6 font-medium text-gray-600 text-center">PRICE</th>
//                                                         <th className="py-3 pl-6 font-medium text-gray-600 text-center">QUANTITY</th>
//                                                         <th className="py-3 pr-6 font-medium text-gray-600 text-right">SUB-TOTAL</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {cartItems.map((item) => (
//                                                         <CartItem key={item.product} {...item} inCart={true} />
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>

//                                         <div className="my-6 pl-6 flex justify-between">
//                                             <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 p-2 border-2 border-blue-600 rounded-lg">
//                                                 <FaArrowLeft className="mr-2" /> Return to Shop
//                                             </Link>
//                                             {/* <button 
//                                                 onClick={placeOrderHandler} 
//                                                 disabled={cartItems.length < 1}
//                                                 className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center ${cartItems.length < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                             >
//                                                 Proceed to Checkout <FaArrowRight className="ml-2" />
//                                             </button> */}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Right Column - Price Summary */}
//                         <div className="md:w-1/3">
//                             {renderPriceSidebar()}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <LoginModal 
//                 isOpen={showLoginModal} 
//                 onClose={() => setShowLoginModal(false)} 
//             />
//         </>
//     );
// };

// export default Cart;


import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import MetaData from '../Layouts/MetaData';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import LoginModal from '../User/LoginModal';
import { formatPrice } from '../../utils/formatPrice';
import { useEffect } from 'react';

// Add a hook to detect mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
}

const Cart = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { saveForLaterItems } = useSelector((state) => state.saveForLater);
    const { loading, isAuthenticated, error } = useSelector((state) => state.user);
    const isMobile = useIsMobile();

    const placeOrderHandler = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
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
        <div className='space-y-4 md:space-y-5'>
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-5 text-gray-800">Order Summary</h2>
                <div className="space-y-3 md:space-y-4">
                    <PriceRow label="Sub-total" value={formatPrice(subtotal)} />
                    <PriceRow label="Shipping" value="Free" isDiscount />
                    <PriceRow label="Discount" value={`${formatPrice(discount)}`} isDiscount />
                    <PriceRow label="Tax (10%)" value={formatPrice(tax)} />
                    <PriceRow label="Total" value={formatPrice(finalTotal)} isTotal />
                </div>
                <button
                    onClick={placeOrderHandler}
                    disabled={cartItems.length === 0}
                    className={`w-full bg-[#003366] hover:bg-[#003366] text-white py-2 md:py-3 rounded-md transition-colors duration-200 mt-4 md:mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer ${
                        cartItems.length === 0 ? 'opacity-50' : ''
                    } text-sm md:text-base`}
                >
                    {cartItems.length === 0 ? 'Your cart is empty' : isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
                <h3 className="text-sm md:text-base font-medium mb-2 md:mb-3 text-gray-700">Apply Coupon</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        className="flex-1 border border-gray-300 rounded-md sm:rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-[#003366] hover:bg-[#003366] text-white px-4 py-2 rounded-md sm:rounded-r-md transition-colors duration-200 text-sm font-medium hover:cursor-pointer">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <MetaData title="Shopping Cart | DhagaKart" />
            <main className="w-full min-h-[91vh] px-4 md:px-12 mt-4 md:mt-10">
                <div className="container mx-auto py-4 md:py-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Column - Cart Items */}
                        <div className="md:w-2/3 w-full mt-4 md:mt-0">
                            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-lg md:text-xl font-semibold p-4 md:p-6">Shopping Cart</h2>
                                 
                                {cartItems.length === 0 ? (
                                    <EmptyCart />
                                ) : (
                                    <div>
                                        {/* Cart items table for desktop, cards for mobile */}
                                        {isMobile ? (
                                            <div className="flex flex-col gap-4 p-2">
                                                {cartItems.map((item) => (
                                                    <div key={item.product} className="flex flex-col bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4">
                                                        <div className="flex items-center mb-2">
                                                            <img className="h-16 w-16 object-contain mr-4" src={item.images[0].url} alt={item.name} />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900 text-base">{item.name}</div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-blue-700 font-semibold">{formatPrice(item.price)}</span>
                                                                    {item.cuttedPrice > item.price && (
                                                                        <span className="text-xs text-gray-500 line-through">{formatPrice(item.cuttedPrice)}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <button onClick={() => {
                                                                // Remove item logic
                                                                const event = new Event('remove-cart-item');
                                                                event.product = item.product;
                                                                window.dispatchEvent(event);
                                                            }}
                                                                className="text-gray-400 hover:text-red-500 ml-2 hover:cursor-pointer"
                                                                aria-label="Remove item"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                                <button onClick={() => {
                                                                    // Decrease quantity logic
                                                                    const event = new Event('decrease-cart-qty');
                                                                    event.product = item.product;
                                                                    window.dispatchEvent(event);
                                                                }} className="p-1 hover:bg-gray-100 hover:cursor-pointer" disabled={item.quantity <= 1}>-</button>
                                                                <span className="px-3 py-1">{item.quantity}</span>
                                                                <button onClick={() => {
                                                                    // Increase quantity logic
                                                                    const event = new Event('increase-cart-qty');
                                                                    event.product = item.product;
                                                                    window.dispatchEvent(event);
                                                                }} className="p-1 hover:bg-gray-100 hover:cursor-pointer">+</button>
                                                            </div>
                                                            <div className="text-right font-medium">Subtotal: {formatPrice(item.price * item.quantity)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[600px] md:min-w-0 text-sm md:text-base">
                                                    <thead className='bg-[#F2F4F5] hidden md:table-header-group'>
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
                                        )}
                                        <div className="my-4 md:my-6 pl-0 md:pl-6 flex flex-col md:flex-row md:justify-between gap-3 md:gap-0">
                                            <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 p-2 border-2 border-blue-600 rounded-lg w-max text-sm md:text-base ml-4 md:ml-0">
                                                <FaArrowLeft className="mr-2" /> Return to Shop
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="md:w-1/3 w-full">
                            <div className="md:sticky md:top-24">
                                {renderPriceSidebar()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
        </>
    );
};

export default Cart;