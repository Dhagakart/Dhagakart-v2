import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({ product, name, image, quantity, unit, isSample = false, updateAction, removeAction }) => {
    const dispatch = useDispatch();

    const increaseQuantity = () => {
        const newQty = Math.min(unit?.maxQty || Infinity, quantity + (unit?.increment || 1));
        dispatch(updateAction(product, newQty, unit));
    };

    const decreaseQuantity = () => {
        const newQty = Math.max(unit?.minQty || 1, quantity - (unit?.increment || 1));
        dispatch(updateAction(product, newQty, unit));
    };

    const handleRemoveItem = () => {
        dispatch(removeAction(product));
    };

    const itemPrice = unit?.price || 0;
    const subTotal = itemPrice * quantity;

    return (
        <tr className="border-b border-gray-200 last:border-b-0">
            <td className="py-6 px-6">
                <div className="flex items-center gap-5">
                    <Link to={`/product/${product}`} className="flex-shrink-0 hover:cursor-pointer">
                        {/* --- UI MODIFICATION: Border removed, background added --- */}
                        <div className="h-24 w-24 bg-gray-50 rounded-md flex items-center justify-center">
                           <img className="max-h-full max-w-full object-contain" src={image} alt={name} />
                        </div>
                    </Link>
                    <div className="flex flex-col justify-center">
                        <Link to={`/product/${product}`} className="font-semibold text-gray-900 hover:text-blue-600 hover:cursor-pointer line-clamp-2">
                            {name}
                        </Link>
                        {isSample && (
                             <span className="mt-1 text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full w-max">Sample</span>
                        )}
                        <div className="text-sm text-gray-500 mt-1">Unit: {unit?.name || 'N/A'}</div>
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
            <td className="py-6 px-6 text-center">
                <p className="font-medium text-base text-gray-800">{formatPrice(itemPrice)}</p>
            </td>
            <td className="py-6 px-6">
                <div className="flex items-center justify-center border border-gray-200 rounded-md w-max mx-auto">
                    <button onClick={decreaseQuantity} disabled={quantity <= (unit?.minQty || 1)} className="px-3 py-2.5 hover:bg-gray-100 disabled:opacity-50 transition-colors hover:cursor-pointer">
                        <FaMinus size={12} />
                    </button>
                    <span className="px-4 py-1 text-center font-semibold text-gray-800 w-12">{quantity}</span>
                    <button onClick={increaseQuantity} disabled={quantity >= (unit?.maxQty || Infinity)} className="px-3 py-2.5 hover:bg-gray-100 disabled:opacity-50 transition-colors hover:cursor-pointer">
                        <FaPlus size={12} />
                    </button>
                </div>
            </td>
            <td className="py-6 px-6 text-right">
                <p className="font-bold text-base text-gray-900">{formatPrice(subTotal)}</p>
            </td>
        </tr>
    );
};

export default CartItem;