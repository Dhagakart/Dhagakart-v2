import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';

const EmptyCart = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <FaShoppingBag className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet</p>
            <Link 
                to="/products" 
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default EmptyCart;
