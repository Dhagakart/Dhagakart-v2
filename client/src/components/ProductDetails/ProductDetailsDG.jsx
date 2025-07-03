import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, newReview, getSimilarProducts, getProducts } from '../../actions/productAction';
import { createQuote } from '../../actions/quoteActions';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useSnackbar } from 'notistack';
import toast from 'react-hot-toast';
import { addItemsToCart } from '../../actions/cartAction';
import Slider from 'react-slick';
import StarRating from '../Common/StarRating';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const getDiscount = (price, cuttedPrice) => {
  // Convert to numbers in case they're strings
  const numPrice = Number(price);
  const numCuttedPrice = Number(cuttedPrice);
  
  // If either price is invalid or cuttedPrice is not greater than price, return 0
  if (isNaN(numPrice) || isNaN(numCuttedPrice) || numPrice <= 0 || numPrice <= numCuttedPrice) {
    return 0;
  }
  
  // Calculate discount percentage: ((price - cutted) / price) * 100
  const discount = Math.round(((numPrice - numCuttedPrice) / numPrice) * 100);
  return Math.max(0, Math.min(100, discount)); // Ensure discount is between 0-100
};

const ProductDetailsDG = () => {
  // Hooks must be called unconditionally at the top level
  const dispatch = useDispatch();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  // All state hooks
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteData, setQuoteData] = useState({
    quantity: '1',
    message: '',
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Refs
  const mainSlider = useRef(null);
  const sliderRef = useRef(null);
  
  // All selectors
  const { product, loading, error: productError } = useSelector((state) => state.productDetails);
  const { products: similarProducts = [], loading: similarLoading } = useSelector((state) => state.products);
  const { products: allProducts = [], loading: allProductsLoading } = useSelector((state) => state.allProducts || {});
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { wishlistItems = [] } = useSelector((state) => state.wishlist);
  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  // Debug log the products data
  useEffect(() => {
    console.log('Similar Products:', similarProducts);
    console.log('All Products:', allProducts);
  }, [similarProducts, allProducts]);

  // Get products to display in the slider
  const getDisplayProducts = () => {
    // First, try to get similar products (from the same category)
    const similar = similarProducts
      .filter(item => item && item._id !== product?._id)
      .slice(0, 6);

    // If we have enough similar products, use them
    if (similar.length >= 6) {
      return similar;
    }

    // Otherwise, get other products (from any category)
    const otherProducts = (allProducts?.products || [])
      .filter(item => 
        item && 
        item._id !== product?._id && 
        !similar.some(p => p && p._id === item._id)
      )
      .slice(0, 6 - similar.length);

    // Combine and ensure no duplicates
    let combined = [...similar, ...otherProducts];
    combined = [...new Map(combined.map(item => [item._id, item])).values()];
    
    // If we still have fewer than 6 products, repeat the array to fill the space
    if (combined.length > 0 && combined.length < 6) {
      const needed = 6 - combined.length;
      combined = [...combined, ...combined.slice(0, needed)];
    }
    
    return combined.slice(0, 6);
  };
  
  const displayProducts = getDisplayProducts();

  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (dateString) => {
    if (!dateString) return 'Some time ago';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Some time ago';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'Just now';
  };

  const productId = id;
  const itemInWishlist = wishlistItems.some((i) => i.product === productId);

  // Set initial quantity from cart if item exists
  useEffect(() => {
    if (id && cartItems) {
      const cartItem = cartItems.find((item) => item.product === id);
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

  // Fetch similar products when product details are loaded
  useEffect(() => {
    if (product?._id && product?.category) {
      // First fetch similar products from the same category
      dispatch(getSimilarProducts(product.category));
      
      // Then fetch all products (we'll filter them client-side)
      dispatch(getProducts({
        page: 1,
        price: [0, 100000],
        ratings: 0,
        sort: 'rating,desc',
        limit: 12
      }));
    }
  }, [dispatch, product?._id, product?.category]);

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
    className: 'center',
  };

  // style the toast like a normal react hot toast for success
  const handleAddToCart = () => {
    dispatch(addItemsToCart(id, quantity));
    toast.success(
      quantity > 1 ? `${quantity} items added to cart!` : 'Item added to cart!',
      {
        position: 'top-right',
        duration: 3000, // optional
      }
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleQuoteOpen = () => setQuoteOpen(true);
  const handleQuoteClose = () => setQuoteOpen(false);

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;
    console.log('Form field changed:', { name, value });
    setQuoteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    console.log('Auth state:', { isAuthenticated, user });
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      enqueueSnackbar('Please login to request a quote', { variant: 'warning' });
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      setIsSubmittingQuote(true);
      
      const products = [{
        name: product.name,
        quantity: quoteData.quantity
      }];
      
      const comments = `Product: ${product.name}\n` +
                     `Quantity: ${quoteData.quantity}\n` +
                     `Message: ${quoteData.message || 'No additional message'}`;
      
      const formData = new FormData();
      formData.append('products', JSON.stringify(products));
      formData.append('comments', comments);
      formData.append('file', '');
      formData.append('fileType', '');
      formData.append('fileName', '');
      
      // Create config with proper headers
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      };
      
      const success = await dispatch(createQuote(formData, config));
      
      if (success) {
        enqueueSnackbar('Your quote request has been submitted successfully!', { 
          variant: 'success',
          autoHideDuration: 3000
        });
        navigate('/quote/success', {
          state: {
            message: 'Your quote request has been submitted successfully!',
            productName: product.name,
            quantity: quoteData.quantity,
            messageText: quoteData.message
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit quote. Please try again.', { 
        variant: 'error',
        autoHideDuration: 5000
      });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const reviewSubmitHandler = async () => {
    if (rating === 0 || !comment.trim()) {
      enqueueSnackbar("Please provide both rating and comment", { variant: "error" });
      return;
    }

    try {
      setIsSubmittingReview(true);
      const formData = new FormData();
      formData.set("rating", rating);
      formData.set("comment", comment);
      formData.set("productId", id);

      // Dispatch the review action and wait for it to complete
      const result = await dispatch(newReview(formData));
      
      if (result?.success) {
        // Show success toast
        toast.success('Review submitted successfully!', {
          position: 'top-right',
          duration: 3000,
        });
        
        // If we have the updated product in the response, update the local state
        if (result.product) {
          // This will trigger a re-render with the updated product data
          dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: result.product });
        } else {
          // Fallback: Refresh product details if not included in the response
          await dispatch(getProductDetails(id));
        }
        
        // Reset form
        setRating(0);
        setComment('');
        setActiveTab('review');
      }
      
    } catch (error) {
      console.error('Review submission error:', error);
      enqueueSnackbar(error.message || "Failed to submit review. Please try again.", { 
        variant: "error",
        autoHideDuration: 5000
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Log product details when component mounts or updates
  useEffect(() => {
    if (product) {
      console.log('Product Details:', {
        price: product.price,
        cuttedPrice: product.cuttedPrice,
        calculatedDiscount: getDiscount(product.price, product.cuttedPrice)
      });
    }
  }, [product]);

  useEffect(() => {
    if (success) {
      enqueueSnackbar("Review submitted successfully", { variant: "success" });
      setRating(0);
      setComment('');
      setIsSubmittingReview(false);
      setActiveTab('review');
      dispatch({ type: NEW_REVIEW_RESET });
    }

    if (reviewError) {
      enqueueSnackbar(reviewError, { variant: "error" });
      dispatch(clearErrors());
    }
  }, [dispatch, success, reviewError, enqueueSnackbar]);

  useEffect(() => {
    if (product) {
      console.log('Product Object:', product);
      console.log('Price:', product.price, 'Cutted Price:', product.cuttedPrice);
    }
  }, [product]);

  if (loading) return <Loader />;

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
    <div className="container mx-auto px-16 py-8 mt-10">
      <MetaData title={product.name || 'Product Details'} />
      <Drawer anchor="right" open={quoteOpen} onClose={handleQuoteClose}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Request Bulk Quote</Typography>
            <IconButton onClick={handleQuoteClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
            {product.name}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <form 
            onSubmit={(e) => {
              console.log('Form submit event triggered');
              handleQuoteSubmit(e);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
              }
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quantity (e.g., 10 kg, 5 pieces, 1 box)
              </Typography>
              <TextField
                fullWidth
                name="quantity"
                value={quoteData.quantity}
                onChange={handleQuoteChange}
                placeholder="Enter quantity with unit"
                variant="outlined"
                required
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Additional Message (Optional)
              </Typography>
              <TextField
                fullWidth
                name="message"
                value={quoteData.message}
                onChange={handleQuoteChange}
                placeholder="Any special requirements or details"
                multiline
                rows={4}
                variant="outlined"
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                size="large"
                disabled={isSubmittingQuote}
                sx={{ py: 1.5, color: 'white', backgroundColor: '#003366', hover: { backgroundColor: '#003366' } }}
              >
                {isSubmittingQuote ? 'Submitting...' : 'Request Quote'}
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
      <div className="flex flex-col md:flex-row">
        {/* Product Images */}
        <div className="md:w-[35%] h-auto relative">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm overflow-visible">
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md relative">
                <Slider ref={mainSlider} {...mainSliderSettings} className="w-full h-96">
                  {product?.images?.map((img, index) => (
                    <div key={index} className="h-96 flex items-center justify-center">
                      <div className="flex justify-center items-center w-full h-full">
                        <img
                          src={img?.url || 'https://via.placeholder.com/500'}
                          alt={`${product?.name} - ${index + 1}`}
 Williamsburg className="max-h-full max-w-full object-contain rounded-lg"
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
          <div>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex justify-center gap-2">
                  {product?.images?.map((img, index) => (
                    <div
                      key={index}
                      className={`h-16 w-16 p-[1px] rounded-sm overflow-hidden cursor-pointer transition-all ${selectedImage === index ? 'shadow-md border border-blue-600' : 'hover:shadow-sm'
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
        <div className="md:w-[40%] ml-6">
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={product.ratings || 0} starSize="w-4 h-4" showText={false} />
            <span className="text-black text-sm font-medium">
              {(product.ratings || 0).toFixed(1)} star Rating{' '}
              <span className="text-gray-500">({product.numOfReviews || 0} Reviews)</span>
            </span>
          </div>
          <div className="mb-1 max-w-lg mb-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
          </div>
          <div className="mb-3">
            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-2xl font-bold text-blue-800">
                ₹{product.cuttedPrice?.toLocaleString()}{' '}
                <span className="text-gray-500 font-normal line-through text-lg ml-2">
                  ₹{product.price?.toLocaleString()}
                </span>
              </span>
              <span className="text-green-700 text-lg">
                {getDiscount(product.price, product.cuttedPrice)}% off
              </span>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg w-40">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="px-3 text-black font-bold disabled:opacity-80 disabled:cursor-not-allowed w-12 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l transition-colors hover:cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4" />
                  </svg>
                </button>
                <span className="flex-1 text-center font-medium" data-testid="quantity-display">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3 text-black font-bold w-12 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r transition-colors hover:cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 bg-[#003366] text-white hover:bg-[#003366]/90 cursor-pointer transition-colors rounded-lg font-medium text-sm shadow-sm whitespace-nowrap hover:cursor-pointer"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-6 border border-[#003366] text-[#003366] hover:border-[#003366]/90 hover:text-[#003366]/90 hover:cursor-pointer transition-all rounded-lg font-medium text-sm shadow-sm whitespace-nowrap hover:cursor-pointer"
                >
                  BUY NOW
                </button>
              </div>
            </div>
            {/* Highlights */}
            <div className="pt-4">
              <h3 className="text-base font-large mb-2">Features</h3>
              {product?.highlights?.map((feature, index) => (
                <ol key={index} className="text-sm space-y-1 list-disc ml-4">
                  <li className="text-sm text-gray-800 mb-2">{feature}</li>
                </ol>
              ))}
              {product?.specifications?.map((specification, index) => (
                <ol key={index} className="text-sm space-y-1 list-disc ml-4">
                  <li className="text-sm text-gray-800 mb-2">{specification.title}: {specification.description}</li>
                </ol>
              ))}
            </div>
          </div>
        </div>
        <div className="md:w-[25%] ml-6 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Bulk Purchase Options</h3>
            <button className="w-full flex items-center justify-center gap-2 py-3 mb-3 bg-green-600 text-white rounded-lg text-base font-medium hover:bg-green-700 transition-colors duration-200 hover:cursor-pointer">
              Chat on WhatsApp
            </button>
            <button
              onClick={handleQuoteOpen}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-900 text-white rounded-lg text-base font-medium hover:bg-blue-950 transition-colors duration-200 hover:cursor-pointer"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Stacked Sections */}
      <div className="w-full space-y-6 mt-6">
        {/* Description Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-5 text-gray-800">Description</h2>
          <div className="bg-gray-100 rounded-lg shadow-sm p-6">
            <p className="text-gray-800 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-5 text-gray-800">Additional Information</h2>
          <div className="bg-gray-100 rounded-lg shadow-sm p-6">
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
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-5 text-gray-800">Customer Reviews</h2>
          <div className="bg-gray-100 rounded-lg shadow-sm p-6">
            <div className="space-y-8">
              {/* Add Review Form */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none hover:cursor-pointer"
                      >
                        <svg
                          className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none h-48"
                    placeholder="Share your thoughts about this product..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={reviewSubmitHandler}
                    disabled={isSubmittingReview}
                    className={`px-4 py-2 rounded-md text-white font-medium ${isSubmittingReview ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none hover:cursor-pointer`}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
              {/* Reviews List */}
              {product.numOfReviews > 0 && product.reviews && product.reviews.length > 0 ? (
                <div className="flex gap-6">
                  {/* Overall Rating (Review Widget) */}
                  <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 w-2/3 h-96 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Review</h3>
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-4xl font-bold text-gray-800">{(product.ratings || 0).toFixed(1)}</div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <StarRating rating={product.ratings || 0} starSize="w-5 h-5" showText={false} />
                          <span className="ml-2 text-sm text-gray-600">Product Rating</span>
                        </div>
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = product.reviews.filter((r) => r.rating === star).length;
                          const percentage = product.numOfReviews > 0 ? (count / product.numOfReviews) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-4 mb-2">
                              <span className="w-12 text-sm text-gray-600">{star} star</span>
                              <div className="flex-1 bg-gray-200 h-4 rounded-full">
                                <div
                                  className="bg-green-600 h-4 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="w-12 text-sm text-gray-600 text-right">{percentage.toFixed(0)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="w-1/3 h-96 overflow-y-auto space-y-4 pr-2">
                    {[...product.reviews]
                      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                      .map((review, index) => (
                      <div key={`${review._id || index}`} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                            {review.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-blue-600 font-medium">{review.name || 'Anonymous'}</span>
                                <span className="text-gray-500 text-sm ml-2">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <StarRating rating={review.rating} starSize="w-4 h-4" showText={false} />
                            </div>
                            <p className="text-gray-700 text-sm mb-2">
                              {review.comment || 'No review content available.'}
                            </p>
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
          </div>
        </div>
          {/* Similar Products Slider */}
          {product && displayProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
              <div className="relative">
                {/* Left Navigation Button */}
                <button
                  onClick={handleScrollLeft}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-[#003366] hover:bg-[#002244] shadow-md hover:cursor-pointer transition-colors"
                  aria-label="Scroll left"
                >
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Products Container */}
                <div
                  ref={sliderRef}
                  className="flex overflow-x-auto scroll-smooth space-x-6 py-4 px-2"
                  style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {displayProducts.map((product) => (
                      <div key={product._id} className="flex-shrink-0 w-56">
                        <div
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                        >
                          <div className="h-48 flex items-center justify-center mb-3">
                            <img
                              src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                              alt={product.name}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                            {product.name}
                          </h3>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-900">
                                ₹{product.price?.toLocaleString()}
                              </span>
                              {product.cuttedPrice > product.price && (
                                <span className="text-xs text-gray-500 line-through ml-2">
                                  ₹{product.cuttedPrice?.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {product.cuttedPrice > product.price && (
                              <span className="text-xs text-green-600 mt-1 block">
                                {getDiscount(product.cuttedPrice, product.price)}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Right Navigation Button */}
                <button
                  onClick={handleScrollRight}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-[#003366] hover:bg-[#002244] shadow-md hover:cursor-pointer transition-colors"
                  aria-label="Scroll right"
                >
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductDetailsDG;