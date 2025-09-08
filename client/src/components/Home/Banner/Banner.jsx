// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import Slider from "react-slick"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"

// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

// // Example banner images (swap with your actual assets)
// import Banner1 from "../../../assets/images/banner1.png"
// import BannerTop from "../../../assets/images/bannerTop.png"
// import BannerBottom from "../../../assets/images/bannerBottom.png"
// import poco from "../../../assets/images/Banners/poco-m4-pro.webp"
// import realme from "../../../assets/images/Banners/realme-9-pro.webp"

// // ——————————————————————————————————————————————————
// // 1) Custom dot styles
// // ——————————————————————————————————————————————————
// const customDotsStyles = `
//   .slick-dots.custom-dots {
//     bottom: 20px !important;
//     left: 20px !important;
//     width: auto !important;
//     text-align: left !important;
//   }
//   .slick-dots.custom-dots li {
//     margin: 0 4px !important;
//     width: 12px !important;
//     height: 12px !important;
//   }
//   .slick-dots.custom-dots li button:before {
//     color: #ADB7BC !important;
//     opacity: 1 !important;
//     font-size: 12px !important;
//     width: 12px !important;
//     height: 12px !important;
//     line-height: 12px !important;
//   }
//   .slick-dots.custom-dots li.slick-active button:before {
//     color: black !important;
//     opacity: 1 !important;
//   }
// `

// // ——————————————————————————————————————————————————
// // 2) Force Slick internals to fill 100% of container & remove spacing
// // ——————————————————————————————————————————————————
// const fullSizeCarouselStyles = `
//   .slick-slider,
//   .slick-list,
//   .slick-track,
//   .slick-slide {
//     height: 100% !important;
//     margin: 0 !important;
//     padding: 0 !important;
//   }

//   .slick-slide > div {
//     height: 100%;
//     margin: 0;
//     padding: 0;
//   }

//   /* Make each slide’s <img> cover the entire slide area */
//   .slick-slide img {
//     display: block !important;
//     width: 100% !important;
//     height: 100% !important;
//     object-fit: cover !important;
//   }

//   /* ───────────── REMOVE ALL FOCUS STYLES INSIDE SLICK ───────────── */
//   .slick-slider *:focus {
//     outline: none !important;
//     box-shadow: none !important;  
//   }
// `

// // Custom arrow components
// export const PreviousBtn = ({ className, onClick }) => (
//   <div className={className} onClick={onClick}>
//     <ArrowBackIosIcon fontSize="small" />
//   </div>
// )

// export const NextBtn = ({ className, onClick }) => (
//   <div className={className} onClick={onClick}>
//     <ArrowForwardIosIcon fontSize="small" />
//   </div>
// )

// const Banner = () => {
//   const navigate = useNavigate();

//   // Inject Slick overrides on mount
//   useEffect(() => {
//     const dotStyleEl = document.createElement('style')
//     dotStyleEl.textContent = customDotsStyles
//     document.head.appendChild(dotStyleEl)

//     const fullSizeStyleEl = document.createElement('style')
//     fullSizeStyleEl.textContent = fullSizeCarouselStyles
//     document.head.appendChild(fullSizeStyleEl)

//     return () => {
//       document.head.removeChild(dotStyleEl)
//       document.head.removeChild(fullSizeStyleEl)
//     }
//   }, [])

//   // Slider settings
//   const settings = {
//     autoplay: true,
//     autoplaySpeed: 5000,
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     dotsClass: 'slick-dots custom-dots',
//     prevArrow: <PreviousBtn />,
//     nextArrow: <NextBtn />
//   }

//   // Use Banner1 for all slides (replace or extend as needed)
//   const banners = [Banner1, Banner1, Banner1]

//   return (
//     <div className="w-full h-[200px] sm:h-[600px] bg-white py-8 flex gap-4 hover:cursor-pointer" onClick={() => navigate('/product/6862c4bb5235d86a799dc67d')}>
//       {/* LEFT COLUMN: Carousel */}
//       <div className="w-3/5 h-full rounded-sm shadow relative overflow-hidden">
//         <Slider {...settings} className="h-full">
//           {banners.map((src, idx) => (
//             <div key={idx} className="h-full w-full">
//               <img
//                 draggable="false"
//                 className="h-full w-full focus:outline-none focus:ring-0"
//                 src={src}
//                 alt={`banner-slide-${idx}`}
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* RIGHT COLUMN: Two “Cards” Stacked */}
//       <div className="w-2/5 h-full flex flex-col gap-4">
//         {/* TOP CARD */}
//         <div className="h-1/2 bg-gray-900 rounded-sm shadow overflow-hidden relative hover:cursor-pointer" onClick={() => navigate('/product/6862c4bb5235d86a799dc67d')}>
//           <div className="absolute top-4 right-4 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded">
//             29% OFF
//           </div>
//           <div className="flex h-full w-full">
//             <div className="flex-1 px-6 py-4 flex flex-col justify-center">
//               <p className="text-sm text-yellow-500 font-medium">SUMMER SALES</p>
//               <h3 className="mt-1 text-2xl font-bold text-white">Flora Zari Thread</h3>
//               <button className="mt-4 w-max bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded hover:cursor-pointer">
//                 SHOP NOW →
//               </button>
//             </div>
//             <div className="flex-1 flex items-center justify-center pr-4">
//               <img
//                 draggable="false"
//                 className="max-h-full max-w-full object-contain"
//                 src={BannerTop}
//                 alt="pixel-6-pro"
//               />
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM CARD */}
//         <div className="h-1/2 bg-white rounded-sm shadow overflow-hidden relative hover:cursor-pointer" onClick={() => navigate('/product/6862c4bb5235d86a799dc67d')}>
//           <div className="flex h-full w-full">
//             <div className="flex-1 flex items-center justify-center pl-4">
//               <img
//                 draggable="false"
//                 className="max-h-full max-w-full object-contain"
//                 src={BannerBottom}
//                 alt="xiaomi-flipbuds-pro"
//               />
//             </div>
//             <div className="flex-1 px-6 py-4 flex flex-col justify-center">
//               <h3 className="text-xl font-semibold text-gray-800">Flora Zari Thread</h3>
//               <p className="mt-2 text-2xl font-bold text-blue-500">Rs 299</p>
//               <button className="mt-4 w-max bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded hover:cursor-pointer">
//                 SHOP NOW →
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Banner


import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

// Example banner images (swap with your actual assets)
import Banner1 from "./Banner1.png"
import Banner2 from "./Banner2.png"
import Banner3 from "./Banner3.png"
import BannerTop from "../../../assets/images/bannerTop.png"
import BannerBottom from "../../../assets/images/bannerBottom.png"

// ——————————————————————————————————————————————————
// 1) Custom dot styles
// ——————————————————————————————————————————————————
const customDotsStyles = `
  .slick-dots.custom-dots {
    bottom: 20px !important;
    left: 20px !important;
    width: auto !important;
    text-align: left !important;
  }
  .slick-dots.custom-dots li {
    margin: 0 4px !important;
    width: 12px !important;
    height: 12px !important;
  }
  .slick-dots.custom-dots li button:before {
    color: #ADB7BC !important;
    opacity: 1 !important;
    font-size: 12px !important;
    width: 12px !important;
    height: 12px !important;
    line-height: 12px !important;
  }
  .slick-dots.custom-dots li.slick-active button:before {
    color: black !important;
    opacity: 1 !important;
  }
`

// ——————————————————————————————————————————————————
// 2) Force Slick internals to fill 100% of container & remove spacing
// ——————————————————————————————————————————————————
const fullSizeCarouselStyles = `
  .slick-slider,
  .slick-list,
  .slick-track,
  .slick-slide {
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .slick-slide > div {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  /* Make each slide’s <img> cover the entire slide area */
  .slick-slide img {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }

  /* ───────────── REMOVE ALL FOCUS STYLES INSIDE SLICK ───────────── */
  .slick-slider *:focus {
    outline: none !important;
    box-shadow: none !important;  
  }
`

// Custom arrow components
export const PreviousBtn = ({ className, onClick }) => (
  <div className={className} onClick={onClick}>
    <ArrowBackIosIcon fontSize="small" />
  </div>
)

export const NextBtn = ({ className, onClick }) => (
  <div className={className} onClick={onClick}>
    <ArrowForwardIosIcon fontSize="small" />
  </div>
)

const Banner = () => {
  const navigate = useNavigate();
  const [startX, setStartX] = useState(0);
  const [isValidClick, setIsValidClick] = useState(true);

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsValidClick(true);
  };

  const handleMouseMove = (e) => {
    const distance = Math.abs(e.clientX - startX);
    // If user moved more than 10 pixels, consider it a drag, not a click
    if (distance > 10) {
      setIsValidClick(false);
    }
  };

  const handleMouseUp = () => {
    setStartX(0);
  };

  // Inject Slick overrides on mount
  useEffect(() => {
    const dotStyleEl = document.createElement('style')
    dotStyleEl.textContent = customDotsStyles
    document.head.appendChild(dotStyleEl)

    const fullSizeStyleEl = document.createElement('style')
    fullSizeStyleEl.textContent = fullSizeCarouselStyles
    document.head.appendChild(fullSizeStyleEl)

    return () => {
      document.head.removeChild(dotStyleEl)
      document.head.removeChild(fullSizeStyleEl)
    }
  }, [])

  // Slider settings
  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dotsClass: 'slick-dots custom-dots',
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />
  }

  // Use Banner1 for all slides (replace or extend as needed)
  const banners = [Banner1, Banner2, Banner3]
  const slidePaths = [
    '/products',  // First slide
    '/product/68722597378bce74bc0a5301',  // Second slide
    '/product/6870e1e11022eca9beb2b1c6'  // Third slide
  ]

  return (
    <div className="w-full h-auto lg:h-[600px] bg-white py-4 lg:py-8 flex flex-col lg:flex-row gap-4">
      {/* LEFT COLUMN: Carousel */}
      <div className="w-full lg:w-3/5 h-auto rounded-sm shadow relative hover:cursor-pointer">
        <Slider {...settings} className="h-full">
          {banners.map((src, idx) => (
            <div 
              key={idx} 
              className="w-full h-full relative hover:cursor-pointer"
              style={{ backgroundColor: idx === 0 ? '#003366' : '#F2F4F5' }}
              onClick={(e) => isValidClick && navigate(slidePaths[idx])}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  draggable="false"
                  className="w-full h-full object-contain"
                  src={src}
                  alt={`banner-slide-${idx}`}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* RIGHT COLUMN: Two "Cards" Stacked */}
      <div className="w-full lg:w-2/5 h-full flex flex-col gap-3 sm:gap-4">
        {/* TOP CARD */}
        <div className="h-[180px] sm:h-[200px] lg:h-1/2 bg-gray-900 rounded-sm shadow overflow-hidden relative hover:cursor-pointer transition-all duration-300" onClick={() => navigate('/product/687229f7378bce74bc0a70bd')}>
          <div className="flex flex-row h-full w-full">
            <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-center">
              <p className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-tight">High-Speed Rapier Power Loom - 48</p>
              <h3 className="mt-1 text-xs sm:text-sm md:text-base font-bold text-yellow-400">DEAL FOR WEAVING HIGH-QUALITY SILK SAREES</h3>
              <button className="mt-2 sm:mt-3 w-max bg-[#003366] hover:bg-[#002244] text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors duration-200 hover:cursor-pointer">
                SHOP NOW →
              </button>
            </div>
            <div className="w-1/3 sm:w-2/5 md:w-1/2 flex-shrink-0 flex items-center justify-center p-2">
              <img
                draggable="false"
                className="h-full w-auto max-w-full object-contain"
                src={BannerTop}
                alt="High-Speed Rapier Power Loom"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM CARD */}
        <div className="h-[180px] sm:h-[200px] lg:h-1/2 bg-white rounded-sm shadow overflow-hidden relative hover:cursor-pointer transition-all duration-300" onClick={() => navigate('/product/6870dd3b1022eca9beb2a645')}>
          <div className="flex flex-row h-full w-full">
            <div className="w-1/3 sm:w-2/5 md:w-1/2 flex-shrink-0 flex items-center justify-center p-2">
              <img
                draggable="false"
                className="h-full w-auto max-w-full object-contain"
                src={BannerBottom}
                alt="SHINE SEWING THREAD"
              />
            </div>
            <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col justify-center text-center sm:text-left">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 leading-tight">SHINE SEWING THREAD MULTICOLOR THREAD</h3>
              <button className="mt-2 sm:mt-3 mx-auto sm:mx-0 w-max bg-[#003366] hover:bg-[#002244] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 hover:cursor-pointer">
                SHOP NOW →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner