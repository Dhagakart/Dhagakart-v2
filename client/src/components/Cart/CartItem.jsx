import { useDispatch } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Link } from 'react-router-dom';
import { FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({ product, name, price, cuttedPrice, image, quantity }) => {
    const dispatch = useDispatch();

    const increaseQuantity = (id, currentQty, stock) => {
        const newQty = currentQty + 1;
        if (newQty > stock) return;
        dispatch(addItemsToCart(id, newQty));
    };

    const decreaseQuantity = (id, currentQty) => {
        const newQty = currentQty - 1;
        if (newQty < 1) return;
        dispatch(addItemsToCart(id, newQty));
    };

    const removeItem = (id) => {
        dispatch(removeItemsFromCart(id));
    };

    return (
        <tr className="hover:bg-gray-50">
            {/* Product Column */}
            <td className="py-4 pl-6">
                <div className="flex items-center">
                    <button 
                        onClick={() => removeItem(product)}
                        className="text-gray-400 hover:text-red-500 mr-2 hover:cursor-pointer"
                        aria-label="Remove item"
                    >
                        <FaTimes />
                    </button>
                    <img 
                        className="h-20 w-20 object-contain mr-4" 
                        src={image} 
                        alt={name} 
                    />
                    <span className="text-sm">{name}</span>
                </div>
            </td>
            
            {/* Price Column */}
            <td className="py-4 pl-6 text-center">
                <div className="flex flex-col items-center">
                    <span className="text-gray-900 font-medium">{formatPrice(price)}</span>
                    {cuttedPrice > price && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(cuttedPrice)}</span>
                    )}
                </div>
            </td>
            
            {/* Quantity Column */}
            <td className="py-4 pl-6">
                <div className="flex items-center justify-center py-2 border border-gray-200 rounded-lg">
                    <button 
                        onClick={() => decreaseQuantity(product, quantity)} 
                        className="p-1 hover:bg-gray-100 hover:cursor-pointer"
                        disabled={quantity <= 1}
                    >
                        <FaMinus size={12} />
                    </button>
                    <span className="px-3 py-1">{quantity}</span>
                    <button 
                        onClick={() => increaseQuantity(product, quantity, 10)} // Assuming 10 is max stock
                        className="p-1 hover:bg-gray-100 hover:cursor-pointer"
                    >
                        <FaPlus size={12} />
                    </button>
                </div>
            </td>
            
            {/* Subtotal Column */}
            <td className="py-4 pr-6 text-right">
                <span className="font-medium">{formatPrice(price * quantity)}</span>
            </td>
        </tr>
    );
};

export default CartItem;
