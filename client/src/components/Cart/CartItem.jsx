import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({ product, name, image, price, quantity, unit, isSample = false, sampleConfig, updateAction, removeAction }) => {
    const dispatch = useDispatch();

    // --- FIX: Determine the correct data source based on whether it's a sample ---
    const itemPrice = isSample ? price : (unit?.price || 0);
    const unitName = isSample ? "Sample" : (unit?.name || 'N/A');
    const subTotal = itemPrice * quantity;

    // Determine quantity limits based on order type
    const minQty = isSample ? 1 : (unit?.minQty || 1);
    const maxQty = isSample ? (sampleConfig?.maxQuantity || 1) : (unit?.maxQty || Infinity);
    const increment = isSample ? 1 : (unit?.increment || 1);

    const increaseQuantity = () => {
        const newQty = Math.min(maxQty, quantity + increment);
        // For samples, the `unit` prop will be undefined, which is correct
        dispatch(updateAction(product, newQty, isSample ? null : unit));
    };

    const decreaseQuantity = () => {
        const newQty = Math.max(minQty, quantity - increment);
        // For samples, the `unit` prop will be undefined, which is correct
        dispatch(updateAction(product, newQty, isSample ? null : unit));
    };

    const handleRemoveItem = () => {
        dispatch(removeAction(product));
    };

    return (
        <tr className="border-b border-gray-200 last:border-b-0">
            {/* Product Details Column */}
            <td className="py-6 px-6">
                <div className="flex items-center gap-5">
                    <Link to={`/product/${product}`} className="flex-shrink-0 hover:cursor-pointer">
                        <div className="h-24 w-24 bg-gray-50 rounded-md flex items-center justify-center">
                           <img className="max-h-full max-w-full object-contain" src={image} alt={name} />
                        </div>
                    </Link>
                    <div className="flex flex-col justify-center">
                        <Link to={`/product/${product}`} className="font-semibold text-gray-900 hover:text-blue-600 hover:cursor-pointer line-clamp-2">
                            {name}
                        </Link>
                        {isSample && (
                             <span className="mt-1 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full w-max">Sample</span>
                        )}
                        <div className="text-sm text-gray-500 mt-1">Unit: {unitName}</div>
                        <button 
                            onClick={handleRemoveItem} 
                            className="text-sm text-gray-500 hover:text-red-600 mt-2 font-medium flex items-center gap-1.5 w-max p-1 rounded-md hover:bg-red-50 transition-colors hover:cursor-pointer"
                        >
                            <FaTrash size={12} />
                            Remove
                        </button>
                    </div>
                </div>
            </td>

            {/* Price Column */}
            <td className="py-6 px-6 text-center">
                <p className="font-medium text-base text-gray-800">{formatPrice(itemPrice)}</p>
            </td>

            {/* Quantity Column */}
            <td className="py-6 px-6">
                <div className="flex items-center justify-center border border-gray-200 rounded-md w-max mx-auto">
                    <button onClick={decreaseQuantity} disabled={quantity <= minQty} className="px-3 py-2.5 hover:bg-gray-100 disabled:opacity-50 transition-colors hover:cursor-pointer">
                        <FaMinus size={12} />
                    </button>
                    <span className="px-4 py-1 text-center font-semibold text-gray-800 w-12">{quantity}</span>
                    <button onClick={increaseQuantity} disabled={quantity >= maxQty} className="px-3 py-2.5 hover:bg-gray-100 disabled:opacity-50 transition-colors hover:cursor-pointer">
                        <FaPlus size={12} />
                    </button>
                </div>
            </td>

            {/* Sub-total Column */}
            <td className="py-6 px-6 text-right">
                <p className="font-bold text-base text-gray-900">{formatPrice(subTotal)}</p>
            </td>
        </tr>
    );
};

export default CartItem;
