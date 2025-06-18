import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../../actions/productAction';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useSnackbar } from 'notistack';
import { addItemsToCart } from '../../actions/cartAction';
import Slider from 'react-slick';
import StarRating from '../Common/StarRating';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const ProductDetailsDG = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, loading } = useSelector(state => state.productDetails);
  const { enqueueSnackbar } = useSnackbar();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const mainSlider = useRef(null);



  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  const mainSliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0',
    afterChange: (current) => setSelectedImage(current),
    focusOnSelect: true,
    className: 'center'
  };

  const handleAddToCart = () => {
    dispatch(addItemsToCart(id, quantity));
    enqueueSnackbar('Product added to cart', { variant: 'success' });
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-16 py-8 mt-10">
      <MetaData title={product.name || 'Product Details'} />
      <div className="flex flex-col md:flex-row gap-6">

        {/* Product Images */}
        <div className="md:w-2/6 min-h-screen relative">
          {/* Main Image Slider */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm overflow-visible">
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md relative">
                <Slider ref={mainSlider} {...mainSliderSettings} className="w-full h-">
                  {product?.images?.map((img, index) => (
                    <div key={index} className="h-72 flex items-center justify-center">
                      <div className="flex justify-center items-center w-full h-full">
                        <img
                          src={img?.url || 'https://via.placeholder.com/500'}
                          alt={`${product?.name} - ${index + 1}`}
                          className="max-h-full max-w-full object-contain rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/500';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

              </div>
            </div>
          </div>

          {/* Thumbnail Slider */}
          <div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex justify-center gap-2">
                  {product?.images?.map((img, index) => (
                    <div
                      key={index}
                      className={`h-16 w-16 p-[1px] rounded-sm overflow-hidden cursor-pointer transition-all  ${selectedImage === index
                        ? 'shadow-md border border-blue-600'
                        : 'hover:shadow-sm'
                        }`}
                      onClick={() => {
                        setSelectedImage(index);
                        mainSlider.current?.slickGoTo(index);
                      }}
                    >
                      <img
                        src={img?.url || 'https://via.placeholder.com/500'}
                        alt={`${product?.name || 'Product'} ${index + 1}`}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-3/6">
          {/* Ratings */}
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={4.7} starSize="w-4 h-4" showText={false} />
            <span className="text-black text-sm font-medium">4.7 star Rating <span className='text-gray-500'>(21,671 Reviews)</span></span>
          </div>

          {/* Brand and Title */}
          <div className="mb-1 max-w-lg mb-6">
            {/* <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1> */}
            {/* <h1 className="text-2xl font-medium text-gray-900 mb-2">2020 Apple Macbook Pro with Apple M1 Chip (13 inch, 8 gb RAM, 256 gb SSD) - Space Gray</h1> */}
            <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
          </div>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-2xl font-bold text-blue-800">₹{product.price?.toLocaleString()} <span className="text-gray-500 font-normal line-through text-lg ml-2">₹{product.cuttedPrice?.toLocaleString()}</span></span>
              <span className="text-green-700 text-lg">18% off</span>
            </div>
          </div>

          {/* Offers
  <div className="text-sm mb-4">
    <p className="font-medium mb-2">Available offers</p>
    <ul className="space-y-2">
      <li className="flex items-start">
        <svg className="w-4 h-4 text-green-600 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span><span className="font-medium">Bank Offer</span> 10% off on ICICI Bank Credit Card and Credit/Debit Card EMI Transactions, up to ₹1,500, on orders of ₹5,000 and above</span>
      </li>
      <li className="flex items-start">
        <svg className="w-4 h-4 text-green-600 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span><span className="font-medium">Special Price</span> Get extra 10% off (price inclusive of cashback/coupon)</span>
      </li>
    </ul>
  </div> */}

          {/* Description */}
          {/* <div className="text-sm text-gray-800 mb-4">
    <p>{product.description}</p>
  </div> */}

          {/* Quantity Selector */}
          <div className="mb-4">
            <div className="flex items-center gap-2 max-w-sm">
              <div className="flex items-center border-2 border-gray-200 rounded-lg py-2 w-40 text-lg">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-3 text-black font-bold disabled:opacity-80 disabled:cursor-not-allowed w-12 h-10 flex items-center justify-center hover:cursor-pointer rounded-l transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4" />
                  </svg>
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 text-black font-bold disabled:opacity-80 disabled:cursor-not-allowed w-12 h-10 flex items-center justify-center hover:cursor-pointer rounded-r transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#003366] text-white hover:bg-[#003366]/90 hover:cursor-pointer transition-colors rounded-lg font-medium text-sm shadow-sm"
              >
                ADD TO CART
              </button>
              {/* <span className="text-xs text-gray-500">{product.stock} available</span> */}
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-4 mb-6">
    <button
      onClick={handleAddToCart}
      className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-sm font-medium text-sm shadow-sm"
    >
      ADD TO CART
    </button>
    <button className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-sm font-medium text-sm shadow-sm">
      BUY NOW
    </button>
  </div> */}

          {/* Highlights */}
          <div className="pt-4">
            <h3 className="text-base font-large mb-2">Features</h3>
            <ol className="text-sm space-y-1 list-disc ml-4">
              {/* {product.highlights?.slice(0, 4).map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>{highlight}</span>
                </li>
              ))} */}
              <li className="text-sm text-gray-800 mb-2">Processor: Apple M1 Chip</li>
              <li className="text-sm text-gray-800 mb-2">RAM: 8 GB</li>
              <li className="text-sm text-gray-800 mb-2">Storage: 256 GB</li>
              <li className="text-sm text-gray-800 mb-2">Display: 13-inch Retina Display</li>
              <li className="text-sm text-gray-800 mb-2">Camera: 12 MP</li>
              <li className="text-sm text-gray-800 mb-2">Weight: 1.3 lbs</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsDG;
