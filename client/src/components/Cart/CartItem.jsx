import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { formatPrice } from '../../utils/formatPrice';

const CartItem = ({
    product,
    name,
    price,
    cuttedPrice,
    image,
    quantity,
    unit
}) => {
    const dispatch = useDispatch();

    const increaseQuantity = () => {
        const newQty = quantity + (unit?.increment || 1);
        dispatch(addItemsToCart(product, newQty));
    };

    const decreaseQuantity = () => {
        const newQty = quantity - (unit?.increment || 1);
        if (newQty < (unit?.minQty || 1)) return;
        dispatch(addItemsToCart(product, newQty));
    };

    // This variable now safely gets the unit name from either property
    const unitName = unit?.name || unit?.unit || '';

    return (
        <tr className="border-b hover:bg-gray-50">
            {/* Product Column */}
            <td className="py-4 pl-6 w-2/5">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => dispatch(removeItemsFromCart(product))}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                    >
                        <FaTimes />
                    </button>
                    <Link to={`/product/${product}`}>
                        <img
                            className="h-16 w-16 object-contain"
                            src={image}
                            alt={name}
                        />
                    </Link>
                    <div>
                        <Link to={`/product/${product}`} className="font-medium text-gray-800 hover:text-blue-600">
                            {name}
                        </Link>
                        {/* FIX: Use the safe unitName variable */}
                        {unitName && <p className="text-sm text-gray-500 mt-1">{unitName}</p>}
                    </div>
                </div>
            </td>

            {/* Price Column */}
            <td className="py-4 pl-6 text-center">
                <div className="flex flex-col items-center">
                    <span className="font-medium">{formatPrice(price)}</span>
                    {cuttedPrice > price && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(cuttedPrice)}</span>
                    )}
                </div>
            </td>

            {/* Quantity Column */}
            <td className="py-4 pl-6">
                <div className="flex flex-col items-center mx-auto w-max">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                            onClick={decreaseQuantity}
                            className="p-2 hover:bg-gray-100 disabled:opacity-40"
                            disabled={quantity <= (unit?.minQty || 1)}
                            aria-label="Decrease quantity"
                        >
                            <FaMinus size={12} />
                        </button>
                        <span className="px-4 py-1 text-center font-medium min-w-[60px]">
                           {/* FIX: Use the safe unitName variable */}
                           {`${quantity} ${unitName}`}
                        </span>
                        <button
                            onClick={increaseQuantity}
                            className="p-2 hover:bg-gray-100 disabled:opacity-40"
                            disabled={unit?.maxQty && quantity >= unit.maxQty}
                            aria-label="Increase quantity"
                        >
                            <FaPlus size={12} />
                        </button>
                    </div>
                    {unit?.minQty > 1 && (
                        <div className="text-xs text-gray-500 mt-1">
                            Min: {unit.minQty}
                        </div>
                    )}
                </div>
            </td>

            {/* Subtotal Column */}
            <td className="py-4 pr-6 text-right font-semibold">
                {formatPrice(price * quantity)}
            </td>
        </tr>
    );
};

export default CartItem;