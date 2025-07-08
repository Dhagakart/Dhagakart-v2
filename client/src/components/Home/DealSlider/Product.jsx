// import { Link } from "react-router-dom";
// import Image from './image.png';

// // Default product image
// const defaultImage = Image;

// const Product = ({ 
//   _id, 
//   name, 
//   description,
//   image, 
//   currentPrice,   
//   originalPrice,  
//   discount,
//   link       
// }) => {
//   // Function to safely parse and format prices
//   const formatPrice = (price) => {
//     if (price === undefined || price === null) return 0;
//     if (typeof price === 'string') {
//       return parseInt(price.replace(/,/g, ''), 10) || 0;
//     }
//     return price;
//   };

//   const current = formatPrice(currentPrice);
//   const original = formatPrice(originalPrice);
//   const showDiscount = original > current && discount > 0;

//   return (
//     <Link
//       to={link || `/product/${_id}`}
//       className="relative block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 h-80 w-64 flex flex-col overflow-hidden group"
//     >
//       {/* Product Image */}
//       <div className="w-full h-48 flex items-center justify-center p-1">
//         <img
//           draggable="false"
//           className="h-full w-full object-contain"
//           src={image || defaultImage}
//           alt={name}
//         />
//       </div>

//       {/* Product Info */}
//       <div className="p-3 text-center flex flex-col justify-between h-32">
//         <div>
//           <h2 className="text-sm text-gray-800 font-medium line-clamp-2">
//             {name}
//           </h2>
//           <p className="text-xs text-gray-500 mt-1">{description}</p>
//         </div>
//         <div className="mt-2 flex items-center justify-center space-x-2">
//           {/* Current Price */}
//           <span className="text-blue-900 font-bold text-base">
//             ₹{current.toLocaleString()}
//           </span>

//           {/* Original (Strikethrough) Price */}
//           {showDiscount && (
//             <span className="text-gray-500 text-sm line-through">
//               ₹{original.toLocaleString()}
//             </span>
//           )}

//           {/* Discount Percentage */}
//           {showDiscount && (
//             <span className="text-green-600 text-xs font-medium">
//               {discount}% OFF
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default Product;

import { Link } from "react-router-dom";
import Image from './image.png';

// Default product image
const defaultImage = Image;

const Product = ({ 
  _id, 
  name, 
  description,
  image, 
  currentPrice,   
  originalPrice,  
  discount,
  link       
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
      to={link || `/product/${_id}`}
      className="relative block bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 h-full w-full flex flex-col overflow-hidden group mx-1"
    >
      {/* Product Image */}
      <div className="w-full h-32 sm:h-60 flex items-center justify-center p-1">
        <img
          draggable="false"
          className="h-full w-full object-contain p-2"
          src={image || defaultImage}
          alt={name}
        />
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 text-center flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-xs sm:text-sm text-gray-800 font-medium line-clamp-2 px-1">
            {name}
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>
        </div>
        <div className="mt-1 sm:mt-2 flex flex-col items-center justify-center space-y-1">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            {/* Current Price */}
            <span className="text-blue-900 font-bold text-sm sm:text-base">
              ₹{current.toLocaleString()}
            </span>

            {/* Original (Strikethrough) Price */}
            {showDiscount && (
              <span className="text-gray-500 text-[10px] sm:text-sm line-through">
                ₹{original.toLocaleString()}
              </span>
            )}
          </div>

          {/* Discount Percentage */}
          {showDiscount && (
            <span className="text-green-600 text-[10px] sm:text-xs font-medium">
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Product;