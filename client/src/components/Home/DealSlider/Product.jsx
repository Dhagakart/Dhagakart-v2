import React from 'react';
import { useNavigate } from 'react-router-dom';

// Calculate discount percentage
const getDiscount = (currentPrice, originalPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0;
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

const Product = ({ 
  _id, 
  name, 
  image, 
  currentPrice,   
  originalPrice,  
  discount,
  ratings = 0,
  numOfReviews = 0,
  link
}) => {
  const navigate = useNavigate();
  const isComingSoon = name !== 'Spun Viscose Yarn 30s – Soft Finish';

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

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div 
      className="flex flex-col items-center justify-center gap-2 py-2 md:px-4 px-2 relative rounded-lg overflow-hidden hover:cursor-pointer border border-gray-200 shadow-lg"
      onClick={() => navigate(link || `/product/${_id}`)}
    >
      {isComingSoon && (
        <div className="absolute top-6 -right-9 w-32 text-center transform rotate-45 bg-[#003366] text-white text-[10px] font-bold py-0.5 shadow-md z-10">
          Coming Soon
        </div>
      )}
      
      {/* Product Image */}
      <div className="md:w-48 md:h-48 w-34 h-34 flex items-center justify-center">
        <img 
          draggable="false" 
          className="md:w-full md:h-full w-32 h-32 object-contain" 
          src={image} 
          alt={name} 
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2 items-start w-full">
        {/* Rating Badge */}
        <div className="flex items-start gap-1.5 mt-1">
          <div className="flex">
            {renderStars(ratings)}
          </div>
          <span className="text-xs text-gray-500">({numOfReviews})</span>
        </div>

        <h2 className="text-sm h-12 mt-1 text-start">
          {name.length > 55 ? `${name.substring(0, 55)}...` : name}
        </h2>

        {/* Price Container */}
        <div className="flex items-center gap-1.5 text-md font-medium">
          <span className='text-[#003366]'>₹{current.toLocaleString()}</span>
        </div>
        {showDiscount && (
          <div className="flex items-center gap-1.5 text-md font-medium">
            <span className="text-gray-500 line-through text-xs">
              ₹{original.toLocaleString()}
            </span>
            <span className="text-xs text-green-500">
              {getDiscount(current, original)}% off
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;