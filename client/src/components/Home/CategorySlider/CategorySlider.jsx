import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CategorySlider = () => {
  const sliderRef = useRef(null);

  const categories = [
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100', label: 'Top Offers' },
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100', label: 'Grocery' },
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100', label: 'Mobile' },
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100', label: 'Fashion' },
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100', label: 'Electronics' },
    { img: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/05d708653beff580.png?q=100', label: 'Home' },
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100', label: 'Appliances' },
    { img: 'https://rukminim2.flixcart.com/flap/128/128/image/0d75b34f7d8fbcb3.png?q=100', label: 'Travel' },
    { img: 'https://rukminim2.flixcart.com/fk-p-flap/128/128/image/28833c53894e3b32.png?q=100', label: 'Beauty, Toys & More' },
  ];

  const scrollAmount = 300; // Pixels to scroll on button click

  const handleScrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white py-4">
      <h1 className="text-2xl font-bold text-center mb-4">Shop With Categories</h1>
      <div className="w-full mx-auto">
        <div className="relative">
          {/* Left Navigation Button */}
          <button
            onClick={handleScrollLeft}
            className="absolute bg-[#FA8232] -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full shadow-md"
            aria-label="Scroll left"
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Categories Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scroll-smooth space-x-4 md:space-x-2 py-4"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((category, index) => (
              <div key={index} className="flex-shrink-0 w-[16.1%] text-center">
                <div className="w-full h-60 mx-auto rounded-xl border border-gray-200 flex flex-col justify-center items-center">
                <img
                    src={category.img}
                    alt={category.label}
                    className="w-36 h-36 object-contain"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==';
                    }}
                  />
                  <p className="text-xs my-2 text-gray-700 line-clamp-2">{category.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={handleScrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-[#FA8232] shadow-md"
            aria-label="Scroll right"
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
