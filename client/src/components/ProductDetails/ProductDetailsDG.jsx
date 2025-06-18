import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { cartItems } = useSelector(state => state.cart);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const mainSlider = useRef(null);

  // Set initial quantity from cart if item exists
  useEffect(() => {
    if (id && cartItems) {
      const cartItem = cartItems.find(item => item.product === id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else {
        setQuantity(1);
      }
    }
  }, [id, cartItems]);

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
    enqueueSnackbar(quantity > 1 ? `${quantity} items added to cart` : 'Item added to cart', { 
      variant: 'success' 
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-16 py-8 mt-10">
      <MetaData title={product.name || 'Product Details'} />
      <div className="flex flex-col md:flex-row">
        {/* Product Images */}
        <div className="md:w-[35%] h-auto relative">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm overflow-visible">
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md relative">
                <Slider ref={mainSlider} {...mainSliderSettings} className="w-full h-">
                  {product?.images?.map((img, index) => (
                    <div key={index} className="h-96 flex items-center justify-center">
                      <div className="flex justify-center items-center w-full h-full">
                        <img
                          src={img?.url || 'https://via.placeholder.com/500'}
                          alt={`${product?.name} - ${index + 1}`}
                          className="max-h-full max-w-full object-contain rounded-lg"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/500'; }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex justify-center gap-2">
                  {product?.images?.map((img, index) => (
                    <div
                      key={index}
                      className={`h-16 w-16 p-[1px] rounded-sm overflow-hidden cursor-pointer transition-all ${selectedImage === index ? 'shadow-md border border-blue-600' : 'hover:shadow-sm'}`}
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
        <div className="md:w-[40%] ml-6">
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={product.ratings || 0} starSize="w-4 h-4" showText={false} />
            <span className="text-black text-sm font-medium">
              {(product.ratings || 0).toFixed(1)} star Rating <span className="text-gray-500">({product.numOfReviews || 0} Reviews)</span>
            </span>
          </div>
          <div className="mb-1 max-w-lg mb-6">
            {/* <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1> */}
            <h1 className="text-2xl font-medium text-gray-900 mb-2">MacBook Pro 13-inch Retina Display 2024 M2 Chip 8GB 256GB 128GB</h1>
          </div>
          <div className="mb-3">
            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-2xl font-bold text-blue-800">
                ₹{product.price?.toLocaleString()} <span className="text-gray-500 font-normal line-through text-lg ml-2">₹{product.cuttedPrice?.toLocaleString()}</span>
              </span>
              <span className="text-green-700 text-lg">18% off</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg w-40">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="px-3 text-black font-bold disabled:opacity-80 disabled:cursor-not-allowed w-12 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4" />
                  </svg>
                </button>
                <span className="flex-1 text-center font-medium" data-testid="quantity-display">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 text-black font-bold w-12 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-[#003366] text-white hover:bg-[#003366]/90 cursor-pointer transition-colors rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-6 border border-[#003366] text-[#003366] hover:border-[#003366]/90 hover:text-[#003366]/90 hover:cursor-pointer transition-all rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
                >
                  BUY NOW
                </button>
              </div>
            </div>
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
        <div className="w-[25%] ml-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Want to buy bulk quantity?</h3>
            <button className="w-full py-2 mb-2 bg-[#7BC363] text-white rounded-md text-sm font-medium transition-colors hover:cursor-pointer">
              Chat on WhatsApp
            </button>
            <button className="w-full py-2 bg-[#003366] text-white rounded-md text-sm font-medium hover:bg-[#002b57] transition-colors hover:cursor-pointer">
              Request a Quote
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Description Section */}
      <div className="w-full bg-white rounded-xl mt-6 p-6 border border-gray-200 overflow-auto">
        <div className="flex justify-center border-b border-gray-200 mb-4">
          <div className="flex">
            {['DESCRIPTION', 'ADDITIONAL INFORMATION', 'REVIEW'].map((tab) => (
              <div
                key={tab}
                className={`uppercase px-6 py-2 cursor-pointer text-sm ${activeTab === tab.toLowerCase() ? 'text-[#003366] border-b-4 border-[#003366] font-medium' : 'text-gray-600'}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-sm p-6">
          {activeTab === 'description' && (
            <div>
            <h2 className="text-xl font-semibold mb-5 text-gray-800">Description</h2>
            <p className="text-gray-800 text-sm leading-relaxed">
              {product.description + ' The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. Add to that a stunning Liquid Retina XDR display, the best camera and audio ever in a Mac notebook, and all the ports you need. The first notebook of its kind, this MacBook Pro is a beast. M1 Pro takes the exceptional performance of the M1 architecture to a whole new level for users. Even the most ambitious projects are easily handled with up to 10 CPU cores, up to 16 GPU cores, a 16-core Neural Engine, and dedicated encode and decode media engines that support H.264, HEVC, and ProRes codecs.'}
            </p>
            </div>
          )}
          {activeTab === 'additional information' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Features Column */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#003366] mb-6 pb-3 border-b border-gray-200">Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0">
                      <span>✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Free 1 Year Warranty</h4>
                      <p className="text-sm text-gray-600 mt-1">Comprehensive coverage for peace of mind</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0">
                      <span>🚚</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Fast & Free Delivery</h4>
                      <p className="text-sm text-gray-600 mt-1">Quick shipping to your doorstep</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0">
                      <span>🤝</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Money-back Guarantee</h4>
                      <p className="text-sm text-gray-600 mt-1">100% satisfaction or your money back</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info Column */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#003366] mb-6 pb-3 border-b border-gray-200">Shipping Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Standard Shipping</span>
                    <span className="font-medium text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Express Shipping</span>
                    <span className="font-medium text-gray-900">$19.00</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-700">Estimated Delivery</span>
                    <span className="font-medium text-gray-900">2-4 business days</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">Orders are processed and shipped within 24-48 hours during business days.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'review' && (
            <div>
              {product.numOfReviews > 0 && product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div>
                      <span className="text-4xl font-bold text-gray-800">{product.ratings.toFixed(1)}</span>
                      <p className="text-sm text-gray-600">Product Rating</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(star => {
                        const count = product.reviews.filter(r => r.rating === star).length;
                        const percentage = product.numOfReviews > 0 ? (count / product.numOfReviews * 100).toFixed(1) : 0;
                        return (
                          <div key={star} className="flex items-center mb-2">
                            <span className="w-12 text-sm">{star} star</span>
                            <div className="flex-1 bg-gray-200 h-2 rounded">
                              <div className="bg-green-600 h-2 rounded" style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className="w-12 text-right text-sm">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                          {review.user[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{review.user}</span>
                            <span className="text-gray-500 text-sm">{review.date || '3 Days ago'}</span>
                          </div>
                          <StarRating rating={review.rating} starSize="w-4 h-4" showText={false} />
                          <p className="text-gray-700 text-sm">{review.comment || 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.'}</p>
                          <div className="flex gap-4 mt-1">
                            <button className="text-blue-600 text-sm underline">Like</button>
                            <button className="text-blue-600 text-sm underline">Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 text-sm">No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsDG;