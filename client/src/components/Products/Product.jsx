import { Link } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Image from './image.png';

// Default product image
const defaultImage = Image;

const Product = ({ 
  _id, 
  name, 
  images = [defaultImage], // This default value is overridden by always using defaultImage
  currentPrice,   
  originalPrice,  
  discount        
}) => {
  // Function to safely parse and format prices
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 0;
    if (typeof price === 'string') {
      return parseInt(price.replace(/,/g, ''), 10) || 0;
    }
    return price;
  };

  const current = formatPrice(currentPrice);
  const original = formatPrice(originalPrice);
  const showDiscount = original > current && discount > 0;

  return (
    <Link
      to={`/product/${_id}`}
      className="relative block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 h-80 w-56 flex flex-col overflow-hidden group"
    >
      {/* Hover Overlay: Shopping Cart and Buy Now Button */}
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <ShoppingCartIcon className="h-6 w-6 text-white" />
        <button className="text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium px-3 py-1 rounded">
          Buy Now
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full h-48 flex items-center justify-center bg-gray-50 p-4">
        <img
          draggable="false"
          className="h-full w-full object-contain"
          src={defaultImage}
          alt={name}
        />
      </div>

      {/* Product Info */}
      <div className="p-3 text-center flex flex-col justify-between h-32">
        <div>
          <h2 className="text-sm text-gray-800 font-medium line-clamp-2">
            {name}
          </h2>
        </div>
        <div className="mt-2 flex items-center justify-center space-x-2">
          {/* Current Price */}
          <span className="text-blue-900 font-bold text-base">
            ₹{current.toLocaleString()}
          </span>

          {/* Original (Strikethrough) Price */}
          {showDiscount && (
            <span className="text-gray-500 text-sm line-through">
              ₹{original.toLocaleString()}
            </span>
          )}

          {/* Discount Percentage */}
          {showDiscount && (
            <span className="text-green-600 text-xs font-medium">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;