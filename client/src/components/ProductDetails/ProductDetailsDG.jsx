import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, newReview, getSimilarProducts, getProducts } from '../../actions/productAction';
import { createQuote } from '../../actions/quoteActions';
import MetaData from '../Layouts/MetaData';
import Loader from '../Layouts/Loader';
import { useSnackbar } from 'notistack';
import toast from 'react-hot-toast';
import { addItemsToCart, addItemsToSampleCart } from '../../actions/cartAction';
import Slider from 'react-slick';
import StarRating from '../Common/StarRating';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SampleOrderModal from './SampleOrderModel';
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
  const [selectedUnit, setSelectedUnit] = useState('');
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
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // All selectors
  const { product, loading, error: productError } = useSelector((state) => state.productDetails);
  const { products: similarProducts = [], loading: similarLoading } = useSelector((state) => state.products);
  const { products: allProducts = [], loading: allProductsLoading } = useSelector((state) => state.allProducts || {});
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { wishlistItems = [] } = useSelector((state) => state.wishlist);
  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // Initialize with the default unit when product loads
  useEffect(() => {
    if (product?.orderConfig?.units?.length > 0) {
      const defaultUnit = product.orderConfig.units.find(unit => unit.isDefault);
      setSelectedUnit(defaultUnit?.unit || product.orderConfig.units[0].unit);
    }
  }, [product]);

  // Handle unit change
  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    // Reset quantity to min when unit changes
    if (product?.orderConfig?.units) {
      const unitData = product.orderConfig.units.find(u => u.unit === unit);
      if (unitData) {
        setQuantity(Math.ceil(unitData.minQty));
      }
    }
  };

  // Handle increment with step
  const handleIncrement = () => {
    if (product?.orderConfig?.units) {
      const unitData = product.orderConfig.units.find(u => u.unit === selectedUnit);
      if (unitData) {
        const newQuantity = Math.min(
          unitData.maxQty,
          Math.ceil((quantity + unitData.increment) / unitData.increment) * unitData.increment
        );
        setQuantity(newQuantity);
      }
    }
  };

  // Handle decrement with step
  const handleDecrement = () => {
    if (product?.orderConfig?.units) {
      const unitData = product.orderConfig.units.find(u => u.unit === selectedUnit);
      if (unitData && quantity > unitData.minQty) {
        const newQuantity = Math.max(
          unitData.minQty,
          Math.floor((quantity - unitData.increment) / unitData.increment) * unitData.increment
        );
        setQuantity(newQuantity);
      }
    }
  };

  // Refs
  const mainSlider = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Only run if the product data is available.
    if (product && product.orderConfig) {
      const units = product.orderConfig.units;
      const cartItem = cartItems.find(item => item.product === product._id);

      if (cartItem) {
        // If the item is already in the cart, use its data.
        setSelectedUnit(cartItem.unit?.name || cartItem.unit?.unit);
        setQuantity(cartItem.quantity);
      } else if (units && units.length > 0) {
        // If not in cart, set the default unit and its minimum quantity.
        const defaultUnit = units.find(u => u.isDefault) || units[0];
        if (defaultUnit) {
          setSelectedUnit(defaultUnit.unit);
          setQuantity(defaultUnit.minQty || 1);
        }
      } else {
        // For products with no units, use the base minQty.
        setQuantity(product.orderConfig.minQty || 1);
      }
    }
  }, [product, cartItems]);

  // All selectors
  // const { product, loading, error: productError } = useSelector((state) => state.productDetails);
  // const { products: similarProducts = [], loading: similarLoading } = useSelector((state) => state.products);
  // const { products: allProducts = [], loading: allProductsLoading } = useSelector((state) => state.allProducts || {});
  // const { cartItems = [] } = useSelector((state) => state.cart);
  // const { wishlistItems = [] } = useSelector((state) => state.wishlist);
  // const { success, error: reviewError } = useSelector((state) => state.newReview);
  // const { isAuthenticated, user } = useSelector((state) => state.user);

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

  const mobileSliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // Adds custom styling to position the dots
    dotsClass: "slick-dots !bottom-2"
  };

  // style the toast like a normal react hot toast for success
  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    const newQty = product.orderConfig?.increment
      ? Math.min(
        quantity + (product.orderConfig.increment || 1),
        product.stock,
        // Ensure we don't exceed the maximum possible quantity based on minQty and increment
        product.orderConfig.minQty +
        Math.floor((product.stock - product.orderConfig.minQty) / (product.orderConfig.increment || 1)) * (product.orderConfig.increment || 1)
      )
      : quantity + 1;
    setQuantity(newQty);
    validateQuantity(newQty);
  };

  const decreaseQuantity = () => {
    const newQty = product.orderConfig?.increment
      ? Math.max(
        quantity - (product.orderConfig.increment || 1),
        product.orderConfig?.minQty || 1
      )
      : Math.max(1, quantity - 1);
    setQuantity(newQty);
    validateQuantity(newQty);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
    validateQuantity(value);
  };

  const validateQuantity = (value) => {
    if (!product?.orderConfig) {
      setQuantityError('');
      return;
    }

    const { minQty, increment } = product.orderConfig;

    if (value < minQty) {
      setQuantityError(`Minimum quantity is ${minQty}`);
    } else if (value > product.stock) {
      setQuantityError(`Maximum quantity is ${product.stock}`);
    } else if (increment > 1 && (value - minQty) % increment !== 0) {
      const nextValidQty = Math.ceil((value - minQty) / increment) * increment + minQty;
      setQuantityError(`Please order in multiples of ${increment} (e.g., ${nextValidQty})`);
    } else {
      setQuantityError('');
    }
  };

  // Set initial quantity to minQty when product loads
  useEffect(() => {
    if (product?.orderConfig?.minQty) {
      setQuantity(product.orderConfig.minQty);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedUnit && product?.orderConfig?.units?.length > 0) {
      toast.error('Please select a unit before adding to cart', {
        position: 'top-right',
        duration: 3000,
      });
      return;
    }

    // Get the full unit details
    const unitDetails = product?.orderConfig?.units?.find(u => u.unit === selectedUnit);

    // Validate quantity against unit constraints
    let validatedQuantity = quantity;
    if (unitDetails) {
      validatedQuantity = Math.max(validatedQuantity, unitDetails.minQty || 1);
      if (unitDetails.maxQty) {
        validatedQuantity = Math.min(validatedQuantity, unitDetails.maxQty);
      }
      if (unitDetails.increment > 1) {
        validatedQuantity = Math.ceil(validatedQuantity / unitDetails.increment) * unitDetails.increment;
      }
    }

    // Only update quantity if it was adjusted
    if (validatedQuantity !== quantity) {
      setQuantity(validatedQuantity);
    }

    // Dispatch with unit information
    dispatch(addItemsToCart(id, validatedQuantity, unitDetails || null));

    toast.success(
      validatedQuantity > 1 ? `${validatedQuantity} items added to cart!` : '1 item added to cart!',
      {
        position: 'top-right',
        duration: 3000,
      }
    );
  };

  const handleBuyNow = () => {
    // Call handleAddToCart first to validate and add to cart
    handleAddToCart();
    // Only navigate if we successfully added to cart (no validation errors)
    if (selectedUnit || !product?.orderConfig?.units?.length) {
      navigate('/cart');
    }
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

      const comments = `Product: ${product.name}\n +
                     Quantity: ${quoteData.quantity}\n +
                     Message: ${quoteData.message || 'No additional message'}`;

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
      toast.error("Please provide both a rating and a comment.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      // Send a plain JSON object, not FormData
      const reviewData = {
        rating,
        comment,
        productId: id,
      };

      const result = await dispatch(newReview(reviewData));

      if (result?.success) {
        toast.success('Review submitted successfully!');

        // The backend now returns the updated product.
        // We dispatch it directly to update the UI without another fetch.
        dispatch({ type: 'PRODUCT_DETAILS_SUCCESS', payload: result.product });

        // Reset form and Redux state
        setRating(0);
        setComment('');
        dispatch({ type: NEW_REVIEW_RESET });
      }
    } catch (error) {
      // Display the error from the action's catch block
      toast.error(error.message || "Failed to submit review.");
      dispatch(clearErrors()); // Clear the error from Redux state
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
    <div>
      {/* Main content container */}
      <div className="container mx-auto px-0 md:px-16 py-0 md:py-8 mt-0 md:mt-10 pb-4 md:pb-0">
        <MetaData title={product.name || 'Product Details'} />
        <Drawer anchor="right" open={quoteOpen} onClose={handleQuoteClose}>
          {/* Mobile Attractive Drawer */}
          <div className="md:hidden w-[90vw] max-w-sm mx-auto bg-white rounded-t-2xl shadow-lg border-t border-gray-100 pt-4 pb-6 px-4 relative animate-slideInUp">
            <div className="w-12 h-1.5 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <button onClick={handleQuoteClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-xl font-bold text-gray-900 mb-1 text-center">Request Bulk Quote</div>
            <div className="text-gray-500 text-center text-base mb-4">{product.name}</div>
            <form
              onSubmit={(e) => {
                handleQuoteSubmit(e);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity <span className="text-xs font-normal text-gray-400">(e.g., 10 kg, 5 pieces, 1 box)</span></label>
                <input
                  type="text"
                  name="quantity"
                  value={quoteData.quantity}
                  onChange={handleQuoteChange}
                  placeholder="Enter quantity with unit"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Message <span className="text-xs font-normal text-gray-400">(Optional)</span></label>
                <textarea
                  name="message"
                  value={quoteData.message}
                  onChange={handleQuoteChange}
                  placeholder="Any special requirements or details"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingQuote}
                className="w-full py-3 mt-2 rounded-lg bg-blue-900 text-white font-semibold text-base shadow hover:bg-blue-800 transition disabled:opacity-70"
              >
                {isSubmittingQuote ? 'Submitting...' : 'REQUEST QUOTE'}
              </button>
            </form>
          </div>
          {/* Desktop: keep original Box/Material-UI layout for md+ */}
          <Box sx={{ width: 400, p: 3 }} className="hidden md:block">
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
          {/* Product Images - Mobile View */}
          <div className="md:hidden w-full relative pb-8 bg-white"> {/* Adjusted padding */}
            <div className="w-full relative">
              {/* Use the new mobileSliderSettings and remove the ref */}
              <Slider {...mobileSliderSettings}>
                {product?.images?.map((img, index) => (
                  <div key={index} className="w-full aspect-square flex items-center justify-center">
                    <img
                      src={img?.url || 'https://via.placeholder.com/500'}
                      alt={`${product?.name} - ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500';
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            {/* The entire thumbnail section has been removed */}
          </div>

          {/* Product Images - Desktop View */}
          <div className="hidden md:block md:w-[35%] h-auto relative">
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

          {/* Product Info - Mobile View */}
          <div className="md:hidden w-full px-4 py-3 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 shadow-lg mt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900 mr-2">
                  ₹{(product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.price || 0).toLocaleString()}
                  {selectedUnit && (
                    <span className="text-lg font-normal text-gray-600"> / {selectedUnit}</span>
                  )}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{(product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.cuttedPrice || 0).toLocaleString()}
                </span>
                <span className="ml-2 text-sm text-green-600">
                  {getDiscount(
                    product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.cuttedPrice || 0,
                    product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.price || 0
                  )}% off
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <select
                  value={selectedUnit}
                  onChange={(e) => handleUnitChange(e.target.value)}
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm"
                >
                  {product?.orderConfig?.units?.map((unit) => (
                    <option key={unit.unit} value={unit.unit}>
                      {unit.unit}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.minQty}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.maxQty}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* --- MODIFIED MOBILE ACTION BUTTONS --- */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsSampleModalOpen(true)}
                className="w-full py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg text-sm hover:bg-gray-200 transition-color"
              >
                Order Sample
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 bg-white text-[#003366] border border-[#003366] font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-2.5 bg-[#003366] text-white hover:bg-[#002b57] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Product Info - Desktop View */}
          <div className="hidden md:block md:w-[40%] ml-6">
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
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-blue-800">
                  ₹{(product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.price || 0).toLocaleString()}{' '}
                  {selectedUnit && (
                    <span className="text-lg font-normal text-gray-600"> / {selectedUnit}</span>
                  )}
                  {product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.cuttedPrice >
                    product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.price && (
                      <>
                        <span className="text-gray-500 font-normal line-through text-lg ml-2">
                          ₹{(product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.cuttedPrice || 0).toLocaleString()}
                        </span>
                        <span className="text-green-700 text-lg ml-2">
                          {getDiscount(
                            product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.cuttedPrice || 0,
                            product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.price || 0
                          )}% off
                        </span>
                      </>
                    )}
                </span>
              </div>
              {product.stock > 0 && product.stock <= 10 && (
                <div className="mb-6">
                  <p className="text-amber-700 text-sm font-medium bg-amber-50 px-3 py-1.5 rounded-md inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Only {product.stock} {product.stock === 1 ? 'item' : 'items'} left in stock
                  </p>
                </div>
              )}
            </div>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Unit Selection */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedUnit}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className="w-32 border border-gray-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  >
                    {product?.orderConfig?.units?.map((unit) => (
                      <option key={unit.unit} value={unit.unit}>
                        {unit.unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity Selection with Validation */}
                <div className="flex items-center border-2 border-gray-200 rounded-lg w-40">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.minQty}
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
                    onClick={handleIncrement}
                    disabled={quantity >= product?.orderConfig?.units?.find(u => u.unit === selectedUnit)?.maxQty}
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
              </div>
              {/* --- MODIFIED DESKTOP ACTION BUTTONS --- */}
              <div className="flex flex-col gap-3 w-full sm:w-auto mt-6">
                <button
                  onClick={() => setIsSampleModalOpen(true)}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors rounded-lg font-medium text-sm shadow-sm whitespace-nowrap hover:cursor-pointer"
                >
                  ORDER SAMPLE
                </button>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-6 border border-[#003366] text-[#003366] hover:bg-gray-50 transition-all rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3 px-6 bg-[#003366] text-white hover:bg-[#002b57] transition-colors rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
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
          <div className="hidden md:block md:w-[25%] ml-6 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
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
        <div className="w-full space-y-6 mt-2">
          {/* Description Section - Enhanced for Mobile */}
          <div className="bg-white rounded-xl md:border md:border-gray-200 overflow-hidden">
            <div className="md:hidden bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Product Description
              </h2>
            </div>

            {/* Desktop Title (hidden on mobile) */}
            <h2 className="hidden md:block text-xl font-semibold mb-5 text-gray-800 px-6 pt-6">Description</h2>

            <div className="md:bg-gray-100 md:rounded-lg md:shadow-sm md:mx-6 md:mb-6">
              <div className="p-6 md:p-6">
                <p className="text-gray-800 text-base leading-7 md:text-sm md:leading-relaxed">
                  {product.description}
                </p>

                {/* Additional decorative elements for mobile */}
                <div className="md:hidden mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Key Points</span>
                  </div>

                  {product.keyPoints?.length > 0 ? (
                    <ul className="mt-3 space-y-2 pl-2">
                      {product.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-gray-700 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {['Premium Quality', 'Easy to Use', 'Long Lasting', 'Eco Friendly'].map((point, index) => (
                        <div key={index} className="flex items-center bg-blue-50 rounded-full px-3 py-1.5">
                          <span className="text-blue-600 text-xs font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Bulk Quantity Section - Mobile Only */}
          <div className="md:hidden flex justify-center mt-4">
            <div className="bg-white rounded-xl shadow border border-gray-100 w-full max-w-md mx-auto px-4 py-5">
              <div className="text-lg font-semibold text-gray-800 mb-4">Want to buy bulk quantity?</div>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-gray-700 font-medium bg-white hover:bg-green-50 transition"
                >
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.372.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                  Chat
                </a>
                <button
                  onClick={handleQuoteOpen}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-blue-700 font-medium bg-white hover:bg-blue-50 transition"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 16h6M5 8h14M5 8V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2v-2" /></svg>
                  Get quote
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-xl md:border md:border-gray-200 overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Product Details
              </h2>
            </div>

            {/* Desktop Header */}
            <h2 className="hidden md:block text-xl font-semibold mb-5 text-gray-800 px-6 pt-6">Additional Information</h2>

            <div className="md:bg-gray-100 md:rounded-lg md:shadow-sm md:mx-6 md:mb-6">
              <div className="p-6 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Features Column - Enhanced for Mobile */}
                  <div className="md:bg-white md:p-6 md:rounded-lg md:shadow-sm md:border md:border-gray-100">
                    <h3 className="text-lg font-bold text-[#003366] mb-6 pb-3 border-b border-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 md:hidden" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10a1 1 0 01-1.64 0l-7-10A1 1 0 012 7h4V2a1 1 0 01.7-.954l4-1z" clipRule="evenodd" />
                      </svg>
                      Key Features
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: '✓',
                          title: 'Free 1 Year Warranty',
                          desc: 'Comprehensive coverage for peace of mind'
                        },
                        {
                          icon: '🚚',
                          title: 'Fast & Free Delivery',
                          desc: 'Quick shipping to your doorstep'
                        },
                        {
                          icon: '🤝',
                          title: 'Money-back Guarantee',
                          desc: '100% satisfaction or your money back'
                        }
                      ].map((feature, index) => (
                        <div key={index} className="group flex items-start gap-3 p-3 md:p-0 rounded-lg md:rounded-none transition-all duration-200 md:group-hover:bg-transparent hover:bg-blue-50">
                          <div className="w-10 h-10 md:w-8 md:h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-base md:text-sm flex-shrink-0 transition-all duration-200 group-hover:bg-blue-100 group-hover:scale-105">
                            <span>{feature.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 md:text-gray-900">{feature.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 md:text-gray-600">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile CTA */}
                    <div className="mt-6 md:hidden">
                      <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Contact Us for More Info
                      </button>
                    </div>
                  </div>

                  {/* Shipping Info Column - Enhanced for Mobile */}
                  <div className="bg-white md:p-6 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="md:hidden bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Shipping & Delivery
                      </h3>
                    </div>

                    {/* Desktop Title (hidden on mobile) */}
                    <h3 className="hidden md:block text-lg font-bold text-[#003366] mb-6 pb-3 border-b border-gray-200">Shipping Information</h3>

                    <div className="space-y-4 p-4 md:p-0">
                      {/* Delivery Options */}
                      <div className="md:flex md:justify-between items-center p-3 md:p-0 rounded-lg md:rounded-none transition-all duration-200 hover:bg-blue-50 md:hover:bg-transparent">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-8 md:h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Standard Shipping</h4>
                            <p className="text-sm text-gray-600 mt-1">2-4 business days</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600 mt-2 md:mt-0 block md:inline-block">Free</span>
                      </div>

                      <div className="md:flex md:justify-between items-center p-3 md:p-0 rounded-lg md:rounded-none transition-all duration-200 hover:bg-blue-50 md:hover:bg-transparent">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-8 md:h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Express Shipping</h4>
                            <p className="text-sm text-gray-600 mt-1">1-2 business days</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900 mt-2 md:mt-0 block md:inline-block">$19.00</span>
                      </div>

                      {/* Processing Time */}


                      {/* Delivery Note */}
                      <div className="bg-yellow-50 p-3 rounded-lg mt-3 flex items-start gap-2 text-sm text-yellow-800">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p>Please note that delivery times may be affected by factors outside our control, such as weather conditions or carrier delays.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {/* Mobile Reviews Section */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 md:hidden">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              Customer Reviews
            </h2>
            <div className="bg-gray-50 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">{(product.ratings || 0).toFixed(1)}</span>
                {/* Simple star row */}
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm">({product.numOfReviews || 0} reviews)</span>
              </div>
            </div>
            {/* Review Form */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100 mb-4">
              <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <svg className={`w-7 h-7 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                <textarea id="comment" rows="3" value={comment} onChange={e => setComment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Share your thoughts..." />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={reviewSubmitHandler} disabled={isSubmittingReview} className={`px-4 py-2 rounded-md text-white font-medium ${isSubmittingReview ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none`}>
                  {isSubmittingReview ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
            {/* Reviews List */}
            <div className="space-y-4">
              {product.numOfReviews > 0 && product.reviews && product.reviews.length > 0 ? (
                product.reviews
                  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                  .map((review, idx) => (
                    <div key={review._id || idx} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {review.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-blue-700">{review.name || 'Anonymous'}</span>
                          <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                          <StarRating rating={review.rating} starSize="w-4 h-4" showText={false} />
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment || 'No review content available.'}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-800 text-sm text-center">No reviews yet.</p>
              )}
            </div>
          </div>
          {/* Desktop Reviews Section (unchanged) */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hidden md:block">
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
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                                    className={`bg-green-600 h-4 rounded-full`}
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
          {/* Mobile: Attractive horizontal card slider */}
          {product && displayProducts.length > 0 && (
            <>
              <div className="mt-10 md:hidden">
                <h2 className="text-xl font-semibold mb-4 px-2">You May Also Like</h2>
                <div className="relative">
                  <div
                    className="flex overflow-x-auto space-x-4 px-2 pb-2 scrollbar-hide snap-x snap-mandatory"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {displayProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex-shrink-0 w-48 bg-white rounded-xl shadow-md border border-gray-100 p-3 snap-center cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <div className="h-32 flex items-center justify-center mb-2 bg-gray-50 rounded-lg">
                          <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                            alt={product.name}
                            className="h-full w-full object-contain rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5em]">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-base font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                          {product.cuttedPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through">₹{product.cuttedPrice?.toLocaleString()}</span>
                          )}
                        </div>
                        {product.cuttedPrice > product.price && (
                          <span className="text-xs text-green-600 mt-1 block">{getDiscount(product.cuttedPrice, product.price)}% off</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Desktop: unchanged */}
              <div className="mt-12 hidden md:block">
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
            </>
          )}
        </div>
      </div>
      <SampleOrderModal
        open={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailsDG;