import React from 'react';
import { useLocation } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

const PriceSidebar = ({ cartItems, selectedAddress }) => {
    const location = useLocation();
    const isCartPage = location.pathname === '/cart';

    // Calculate cart totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.cuttedPrice * item.quantity) - (item.price * item.quantity)), 0);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.1; // 10% tax for example
    const finalTotal = total + tax;

    const handleCheckout = () => {
        if (location.pathname === '/shipping') {
            window.location.href = '/process/payment';
        } else {
            window.location.href = '/shipping';
        }
    };

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

    const CouponSection = () => (
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
    );

    if (isCartPage) {
        return (
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
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-200 mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer"
                    >
                        Proceed to Checkout
                    </button>
                </div>
                <CouponSection />
            </div>
        );
    }

    // Checkout page version
    return (
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
            <button
                onClick={handleCheckout}
                disabled={window.location.pathname === '/shipping' && (selectedAddress === null || selectedAddress === undefined)}
                className={`w-full text-white py-3 rounded-md transition-colors duration-200 mt-6 font-medium shadow-md hover:shadow-lg hover:cursor-pointer ${
                    window.location.pathname === '/shipping' && (selectedAddress === null || selectedAddress === undefined)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                Proceed
            </button>
        </div>
    );
}

export default PriceSidebar;