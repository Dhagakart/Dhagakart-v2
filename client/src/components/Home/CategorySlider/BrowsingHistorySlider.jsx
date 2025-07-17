// import React, { useRef } from 'react';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import Tex from './2_ply_purani_tex.jpg';
// import Flora from './flora_zari_thread.jpg';
// import Jack from './jack_a2b.jpg';
// import Mulberry from './mulberry_raw_silk_yarn.jpg';
// import Golden from './pure_golden_zari_thread.jpg';
// import Tussar from './tussar_raw_silk_yarn.jpg';

// const CategorySlider = () => {
//   const sliderRef = useRef(null);

//   const categories = [
//     { 
//       img: Tex, 
//       label: '2 Ply Purani Tex',
//       link: '/products/2%20ply%20purani%20tex' // Update this with your actual route
//     },
//     { 
//       img: Flora, 
//       label: 'Flora Zari Thread',
//       link: '/products/flora%20zari%20thread' // Update this with your actual route
//     },
//     { 
//       img: Jack, 
//       label: 'Jack A2B',
//       link: '/products/jack%20a2b' // Update this with your actual route
//     },
//     { 
//       img: Mulberry, 
//       label: 'Mulberry Raw Silk',
//       link: '/products/mulberry%20raw%20silk' // Update this with your actual route
//     },
//     { 
//       img: Golden, 
//       label: 'Pure Golden Zari',
//       link: '/products/pure%20golden%20zari' // Update this with your actual route
//     },
//     { 
//       img: Tussar, 
//       label: 'Tussar Raw Silk',
//       link: '/products/tussar%20raw%20silk' // Update this with your actual route
//     },
//     { 
//       img: Tex, 
//       label: '2 Ply Purani Tex',
//       link: '/products/2%20ply%20purani%20tex-2' // Update this with your actual route
//     },
//     { 
//       img: Flora, 
//       label: 'Flora Zari Thread',
//       link: '/products/flora%20zari%20thread-2' // Update this with your actual route
//     },
//     { 
//       img: Jack, 
//       label: 'Jack A2B',
//       link: '/products/jack%20a2b' // Update this with your actual route
//     }
//   ];

//   const scrollAmount = 300; // Pixels to scroll on button click

//   const handleScrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//     }
//   };

//   const handleScrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="w-full bg-white py-4">
//       <h1 className="text-2xl font-bold text-center mb-4">Shop With Categories</h1>
//       <div className="w-full mx-auto">
//         <div className="relative">
//           {/* Left Navigation Button */}
//           <button
//             onClick={handleScrollLeft}
//             className="absolute bg-[#003366] -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full shadow-md hover:cursor-pointer"
//             aria-label="Scroll left"
//           >
//             <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           {/* Categories Container */}
//           <div
//             ref={sliderRef}
//             className="flex overflow-x-auto scroll-smooth space-x-4 md:space-x-2 py-4"
//             style={{
//               msOverflowStyle: 'none',
//               scrollbarWidth: 'none',
//             }}
//           >
//             {categories.map((category, index) => (
//               <div key={index} className="flex-shrink-0 w-[16.1%] text-center">
//                 <Link to={category.link} className="block h-full">
//                   <div className="w-full h-60 mx-auto rounded-xl border border-gray-200 flex flex-col justify-center items-center hover:shadow-md transition-shadow">
//                     <img
//                       src={category.img}
//                       alt={category.label}
//                       className="w-36 h-36 object-contain"
//                       onError={(e) => {
//                         e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMGMtNC40MSAwLTggMy41OS04IDhzMy41OSA4IDggOCA4LTMuNTkgOC04LTMuNTktOC04LTh6Ii8+PC9zdmc+';
//                       }}
//                     />
//                     <p className="text-xs my-2 text-gray-700 line-clamp-2 px-2">{category.label}</p>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>

//           {/* Right Navigation Button */}
//           <button
//             onClick={handleScrollRight}
//             className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-[#003366] hover:cursor-pointer shadow-md"
//             aria-label="Scroll right"
//           >
//             <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategorySlider;

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Tex from './2_ply_purani_tex.jpg';
import Flora from './flora_zari_thread.jpg';
import Jack from './jack_a2b.jpg';
import Mulberry from './mulberry_raw_silk_yarn.jpg';
import Golden from './pure_golden_zari_thread.jpg';
import Tussar from './tussar_raw_silk_yarn.jpg';

const BrowsingHistorySlider = () => {
  const sliderRef = useRef(null);

  const categories = [
    { 
      img: Tex, 
      label: '2 Ply Purani Tex',
      link: '/product/6870df2b1022eca9beb2ab2c'
    },
    { 
      img: Flora, 
      label: 'Flora Zari Thread',
      link: '/product/6870e4071022eca9beb2bbd6'
    },
    { 
      img: Jack, 
      label: 'Jack A2B',
      link: '/product/68722597378bce74bc0a5301'
    },
    { 
      img: Mulberry, 
      label: 'Mulberry Raw Silk Yarn',
      link: '/product/6870dd3b1022eca9beb2a645'
    },
    { 
      img: Golden, 
      label: 'Pure Golden Zari Thread',
      link: '/product/6870e56e1022eca9beb2c501'
    },
    { 
      img: Tussar, 
      label: 'Tussar Raw Silk Yarn',
      link: '/product/6870dd3b1022eca9beb2a645'
    },
    { 
      img: Tex, 
      label: '2 Ply Purani Tex',
      link: '/products/2%20ply%20purani%20tex-2' // Update this with your actual route
    },
    { 
      img: Flora, 
      label: 'Flora Zari Thread',
      link: '/products/flora%20zari%20thread-2' // Update this with your actual route
    },
    { 
      img: Jack, 
      label: 'Jack A2B',
      link: '/products/jack%20a2b' // Update this with your actual route
    }
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
      <h1 className="text-2xl font-bold text-center mb-4">You may also like</h1>
      <div className="w-full mx-auto">
        <div className="relative">
          {/* Left Navigation Button */}
          <button
            onClick={handleScrollLeft}
            className="absolute bg-[#003366] -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 hidden sm:flex items-center justify-center rounded-full shadow-md hover:cursor-pointer"
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
              <div key={index} className="flex-shrink-0 w-32 sm:w-[16.1%] text-center">
                <Link to={category.link} className="block h-full">
                  <div className="w-full h-40 sm:h-56 mx-auto rounded-xl border border-gray-200 flex flex-col justify-center items-center hover:shadow-md transition-shadow">
                    <img
                      src={category.img}
                      alt={category.label}
                      className="w-24 h-24 sm:w-40 sm:h-40 object-contain"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMGMtNC40MSAwLTggMy41OS04IDhzMy41OSA4IDggOCA4LTMuNTkgOC04LTMuNTktOC04LTh6Ii8+PC9zdmc+';
                      }}
                    />
                    <p className="text-xs my-2 text-gray-700 line-clamp-2 px-2">{category.label}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={handleScrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 hidden sm:flex items-center justify-center rounded-full bg-[#003366] hover:cursor-pointer shadow-md"
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

export default BrowsingHistorySlider;