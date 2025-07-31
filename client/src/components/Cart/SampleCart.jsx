import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaMinus, FaPlus, FaFlask, FaTrash } from 'react-icons/fa';
import { addItemsToSampleCart, removeItemsFromSampleCart } from '../../actions/cartAction';
import MetaData from '../Layouts/MetaData';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import LoginModal from '../User/LoginModal';
import { formatPrice } from '../../utils/formatPrice';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
}

const SampleCart = () => {
    const dispatch = useDispatch();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();
    
    const { sampleCartItems: cartItems } = useSelector((state) => state.sampleCart);
    const { isAuthenticated } = useSelector((state) => state.user);
    const isMobile = useIsMobile();

    const placeOrderHandler = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        navigate('/sample-shipping'); 
    }

    const calculateCartTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => (item.unit?.price || item.price) * item.quantity + sum, 0);
        const discount = cartItems.reduce((sum, item) => {
            const price = item.unit?.price || item.price;
            const cuttedPrice = item.unit?.cuttedPrice || item.cuttedPrice || price;
            return (price > cuttedPrice) ? sum + (price - cuttedPrice) * item.quantity : sum;
        }, 0);
        
        const discountedSubtotal = subtotal - discount;
        const sgst = discountedSubtotal * 0.05;
        const cgst = discountedSubtotal * 0.05;
        const totalGst = sgst + cgst;
        const shippingCharges = discountedSubtotal >= 499 ? 0 : 100;
        const finalTotal = discountedSubtotal + totalGst + shippingCharges;
        
        return { subtotal, discount, sgst, cgst, shippingCharges, finalTotal };
    };

    const { subtotal, discount, sgst, cgst, shippingCharges, finalTotal } = calculateCartTotals();

    const PriceRow = ({ label, value, isDiscount = false, isTotal = false }) => (
        <div className={`flex justify-between items-center ${isTotal ? 'pt-4 mt-4 border-t border-gray-200' : ''}`}>
            <p className={`${isTotal ? 'font-semibold' : 'text-gray-600'} text-base`}>{label}</p>
            <p className={`${isDiscount ? 'text-green-600' : 'font-medium'} ${isTotal ? 'text-lg font-bold' : 'text-base font-semibold'}`}>{value}</p>
        </div>
    );

    const renderPriceSidebar = () => (
        <div className='space-y-4 md:space-y-5'>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Sample Order Summary</h2>
                <div className="space-y-3 md:space-y-4">
                    <PriceRow label={`Subtotal (${cartItems.length} items)`} value={formatPrice(subtotal)} />
                    {discount > 0 && <PriceRow label="Discount" value={`-${formatPrice(discount)}`} isDiscount />}
                    <PriceRow label="SGST (5%)" value={formatPrice(sgst)} />
                    <PriceRow label="CGST (5%)" value={formatPrice(cgst)} />
                    <PriceRow label="Shipping" value={shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)} isDiscount={shippingCharges === 0} />
                    {shippingCharges > 0 && subtotal < 499 && <div className="text-xs text-green-600 text-right -mt-1">Add ₹{499 - subtotal} more for FREE shipping</div>}
                    <PriceRow label="Total Amount" value={formatPrice(finalTotal)} isTotal />
                </div>
                <button
                    onClick={placeOrderHandler}
                    disabled={cartItems.length === 0}
                    className={`w-full bg-[#003366] hover:bg-[#002b57] text-white py-3 rounded-lg transition-all duration-300 mt-6 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}
                >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <MetaData title="Sample Shopping Cart | DhagaKart" />
            <main className="w-full min-h-screen bg-gray-50 px-4 md:px-12 pt-4 md:pt-10">
                <div className="container mx-auto py-4 md:py-8">
                    {/* --- FIX: Conditional check now wraps the entire layout --- */}
                    {cartItems.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-2/3 w-full">
                                <div className="bg-white rounded-lg shadow-md">
                                    <div className="p-4 bg-blue-50 border-b border-blue-200 rounded-t-lg">
                                        <div className="flex items-center">
                                            {/* <FaFlask className="text-blue-600 mr-3 h-5 w-5 flex-shrink-0" /> */}
                                            <div>
                                                <h3 className="font-semibold text-blue-800">This is a Sample Order</h3>
                                                <p className="text-sm text-blue-700 mt-1">You are ordering samples to evaluate product quality.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-200">Sample Cart ({cartItems.length})</h2>
                                    
                                    {isMobile ? (
                                        <div className="p-4 space-y-4">
                                            {cartItems.map((item) => {
                                                const { unit } = item;
                                                return (
                                                    <div key={item.product} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
                                                        <div className="flex gap-4">
                                                            <Link to={`/product/${item.product}`} className="flex-shrink-0"><img className="h-24 w-24 object-contain rounded-md bg-gray-50 p-1 hover:cursor-pointer" src={item.image} alt={item.name} /></Link>
                                                            <div className="flex flex-col justify-between w-full">
                                                                <div>
                                                                    <Link to={`/product/${item.product}`} className="font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-blue-600 hover:cursor-pointer">{item.name}</Link>
                                                                    <div className="mt-1"><span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Sample</span></div>
                                                                </div>
                                                                <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                            <div className="flex items-center border border-gray-200 rounded-md">
                                                                <button onClick={() => dispatch(addItemsToSampleCart(item.product, Math.max(unit?.minQty || 1, item.quantity - (unit?.increment || 1)), unit))} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer" disabled={item.quantity <= (unit?.minQty || 1)}><FaMinus size={12} /></button>
                                                                <span className="px-4 py-1 text-center font-semibold w-12">{item.quantity}</span>
                                                                <button onClick={() => dispatch(addItemsToSampleCart(item.product, Math.min(unit?.maxQty || Infinity, item.quantity + (unit?.increment || 1)), unit))} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer" disabled={unit?.maxQty ? item.quantity >= unit.maxQty : false}><FaPlus size={12} /></button>
                                                            </div>
                                                            <button onClick={() => dispatch(removeItemsFromSampleCart(item.product))} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 hover:cursor-pointer transition-colors"><FaTrash size={16} /></button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm md:text-base">
                                                <thead className='bg-gray-100'>
                                                    <tr>
                                                        <th className="py-3 px-6 font-semibold text-left text-gray-600 uppercase tracking-wider w-2/5">Product</th>
                                                        <th className="py-3 px-6 font-semibold text-center text-gray-600 uppercase tracking-wider">Price</th>
                                                        <th className="py-3 px-6 font-semibold text-center text-gray-600 uppercase tracking-wider">Quantity</th>
                                                        <th className="py-3 px-6 font-semibold text-right text-gray-600 uppercase tracking-wider">Sub-total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cartItems.map((item) => (
                                                        <CartItem 
                                                            key={item.product} 
                                                            {...item}
                                                            isSample={true}
                                                            inCart={true}
                                                            removeAction={removeItemsFromSampleCart}
                                                            updateAction={addItemsToSampleCart}
                                                        />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="lg:w-1/3 w-full">
                                <div className="lg:sticky lg:top-24">
                                    {renderPriceSidebar()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
};

export default SampleCart;