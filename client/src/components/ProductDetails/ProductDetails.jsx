// import React, { useState, useRef, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getProductDetails, newReview, clearErrors } from '../../actions/productAction';
// import MetaData from '../Layouts/MetaData';
// import Loader from '../Layouts/Loader';
// import { useSnackbar } from 'notistack';
// import { addItemsToCart } from '../../actions/cartAction';
// import Slider from 'react-slick';
// import StarIcon from '@mui/icons-material/Star';
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   Divider,
// } from '@mui/material';
// import { Close as CloseIcon } from '@mui/icons-material';
// import Rating from '@mui/material/Rating';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import { NEW_REVIEW_RESET } from '../../constants/productConstants';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// const ProductDetailsDG = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const { product, loading, error: productError } = useSelector((state) => state.productDetails);
//   const { cartItems } = useSelector((state) => state.cart);
//   const { isAuthenticated } = useSelector((state) => state.user); // Assuming user state includes authentication
//   const { success, error: reviewError } = useSelector((state) => state.newReview);
//   const { enqueueSnackbar } = useSnackbar();
//   const navigate = useNavigate();
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedUnit, setSelectedUnit] = useState(null);
//   const [activeTab, setActiveTab] = useState('description');
//   const [quoteOpen, setQuoteOpen] = useState(false);
//   const [quoteData, setQuoteData] = useState({
//     quantity: 1,
//     message: '',
//   });
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [isSubmittingReview, setIsSubmittingReview] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [viewAll, setViewAll] = useState(false);
//   const mainSlider = useRef(null);

//   // Set initial quantity and unit from cart if item exists
//   useEffect(() => {
//     if (id && cartItems) {
//       const cartItem = cartItems.find((item) => item.product === id);
//       if (cartItem) {
//         setQuantity(cartItem.quantity);
//         if (cartItem.unit) {
//           setSelectedUnit(cartItem.unit);
//         }
//       } else {
//         setQuantity(1);
//         // Set default unit when product loads
//         if (product?.orderConfig?.units?.length > 0) {
//           const defaultUnit = product.orderConfig.units.find(u => u.isDefault) || product.orderConfig.units[0];
//           setSelectedUnit({
//             name: defaultUnit.unit,
//             price: defaultUnit.price,
//             cuttedPrice: defaultUnit.cuttedPrice || defaultUnit.price,
//             minQty: defaultUnit.minQty || 1,
//             maxQty: defaultUnit.maxQty,
//             increment: defaultUnit.increment || 1
//           });
//         }
//       }
//     }
//   }, [id, cartItems]);

//   useEffect(() => {
//     if (id) {
//       dispatch(getProductDetails(id));
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (productError) {
//       enqueueSnackbar(productError, { variant: 'error' });
//       dispatch(clearErrors());
//     }
//     if (reviewError) {
//       enqueueSnackbar(reviewError, { variant: 'error' });
//       dispatch(clearErrors());
//     }
//     if (success) {
//       enqueueSnackbar('Review submitted successfully', { variant: 'success' });
//       setRating(0);
//       setComment('');
//       setIsSubmittingReview(false);
//       // Refetch product details to reload reviews
//       dispatch(getProductDetails(id));
//       dispatch({ type: NEW_REVIEW_RESET });
//     }
//   }, [dispatch, id, productError, reviewError, success, enqueueSnackbar]);

//   const mainSliderSettings = {
//     dots: false,
//     arrows: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     centerMode: true,
//     centerPadding: '0',
//     afterChange: (current) => setSelectedImage(current),
//     focusOnSelect: true,
//     className: 'center',
//   };

//   const handleAddToCart = () => {
//     if (!selectedUnit) {
//       enqueueSnackbar('Please select a unit', { variant: 'error' });
//       return;
//     }
    
//     // Validate quantity against unit constraints
//     let validatedQuantity = Math.max(quantity, selectedUnit.minQty || 1);
//     if (selectedUnit.maxQty) {
//       validatedQuantity = Math.min(validatedQuantity, selectedUnit.maxQty);
//     }
//     if (selectedUnit.increment > 1) {
//       validatedQuantity = Math.round(validatedQuantity / selectedUnit.increment) * selectedUnit.increment || selectedUnit.minQty || 1;
//     }
    
//     if (validatedQuantity !== quantity) {
//       setQuantity(validatedQuantity);
//     }
    
//     dispatch(addItemsToCart(id, validatedQuantity, selectedUnit));
//     enqueueSnackbar(validatedQuantity > 1 ? `${validatedQuantity} items added to cart` : 'Item added to cart', {
//       variant: 'success',
//     });
//   };

//   const handleBuyNow = () => {
//     handleAddToCart();
//     navigate('/cart');
//   };

//   const handleQuoteOpen = () => setQuoteOpen(true);
//   const handleQuoteClose = () => setQuoteOpen(false);

//   const handleQuoteChange = (e) => {
//     const { name, value } = e.target;
//     setQuoteData((prev) => ({
//       ...prev,
//       [name]: name === 'quantity' ? Math.max(1, parseInt(value) || 1) : value,
//     }));
//   };

//   const handleQuoteSubmit = (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       enqueueSnackbar('Please login to request a quote', { variant: 'warning' });
//       return;
//     }
    
//     const quoteRequest = {
//       product: product._id,
//       productName: product.name,
//       quantity: quoteData.quantity,
//       message: quoteData.message,
//     };
    
//     // Here you would typically dispatch an action to submit the quote
//     console.log('Quote submitted:', quoteRequest);
//     enqueueSnackbar('Your quote request has been submitted successfully!', { variant: 'success' });
//     handleQuoteClose();
//   };

//   const handleDialogClose = () => setOpen(!open);

//   const reviewSubmitHandler = () => {
//     if (!isAuthenticated) {
//       enqueueSnackbar('Please log in to submit a review', { variant: 'error' });
//       return;
//     }
//     if (rating === 0 || !comment.trim()) {
//       enqueueSnackbar('Please provide both rating and comment', { variant: 'error' });
//       return;
//     }
//     setIsSubmittingReview(true);
//     const formData = new FormData();
//     formData.set('rating', rating);
//     formData.set('comment', comment);
//     formData.set('productId', id);
//     dispatch(newReview(formData));
//     setOpen(false);
//   };

//   // Calculate discount percentage
//   const calculateDiscount = (price, cuttedPrice) => {
//     if (!price || !cuttedPrice || cuttedPrice <= price) return 0;
//     return Math.round(((cuttedPrice - price) / cuttedPrice) * 100);
//   };
  
//   // Handle unit change
//   const handleUnitChange = (unit) => {
//     setSelectedUnit(unit);
//     // Reset quantity to minimum when changing units
//     setQuantity(unit.minQty || 1);
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="container mx-auto px-16 py-8 mt-10">
//       <MetaData title={product.name || 'Product Details'} />
//       <Drawer anchor="right" open={quoteOpen} onClose={handleQuoteClose}>
//         <Box sx={{ width: 400, p: 3 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h6">Request Bulk Quote</Typography>
//             <IconButton onClick={handleQuoteClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
//             {product.name}
//           </Typography>
//           <Divider sx={{ mb: 3 }} />
          
//           <form onSubmit={handleQuoteSubmit}>
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Quantity
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Button 
//                   variant="outlined" 
//                   onClick={() => setQuoteData(prev => ({
//                     ...prev,
//                     quantity: Math.max(1, prev.quantity - 1)
//                   }))}
//                   disabled={quoteData.quantity <= 1}
//                 >
//                   -
//                 </Button>
//                 <TextField
//                   name="quantity"
//                   type="number"
//                   value={quoteData.quantity}
//                   onChange={handleQuoteChange}
//                   inputProps={{ min: 1, style: { textAlign: 'center' } }}
//                   sx={{ width: '80px' }}
//                 />
//                 <Button 
//                   variant="outlined"
//                   onClick={() => setQuoteData(prev => ({
//                     ...prev,
//                     quantity: prev.quantity + 1
//                   }))}
//                 >
//                   +
//                 </Button>
//               </Box>
//             </Box>
            
//             <Box sx={{ mb: 3 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Additional Message (Optional)
//               </Typography>
//               <TextField
//                 fullWidth
//                 name="message"
//                 multiline
//                 rows={4}
//                 placeholder="Any special requirements or notes..."
//                 value={quoteData.message}
//                 onChange={handleQuoteChange}
//                 variant="outlined"
//               />
//             </Box>
            
//             <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
//               <Button 
//                 type="submit" 
//                 variant="contained" 
//                 color="primary"
//                 fullWidth
//                 size="large"
//                 sx={{ py: 1.5 }}
//               >
//                 Request Quote
//               </Button>
//             </Box>
//           </form>
//         </Box>
//       </Drawer>
//       <div className="flex flex-col md:flex-row">
//         {/* Product Images */}
//         <div className="md:w-[35%] h-auto relative">
//           <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm overflow-visible">
//             <div className="flex justify-center items-center">
//               <div className="w-full max-w-md relative">
//                 <Slider ref={mainSlider} {...mainSliderSettings} className="w-full h-96">
//                   {product?.images?.map((img, index) => (
//                     <div key={index} className="h-96 flex items-center justify-center">
//                       <div className="flex justify-center items-center w-full h-full">
//                         <img
//                           src={img?.url || 'https://via.placeholder.com/500'}
//                           alt={`${product?.name} - ${index + 1}`}
//                           className="max-h-full max-w-full object-contain rounded-lg"
//                           onError={(e) => {
//                             e.target.src = 'https://via.placeholder.com/500';
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </Slider>
//               </div>
//             </div>
//           </div>
//           <div>
//             <div className="flex justify-center">
//               <div className="w-full max-w-md">
//                 <div className="flex justify-center gap-2">
//                   {product?.images?.map((img, index) => (
//                     <div
//                       key={index}
//                       className={`h-16 w-16 p-[1px] rounded-sm overflow-hidden cursor-pointer transition-all ${
//                         selectedImage === index ? 'shadow-md border border-blue-600' : 'hover:shadow-sm'
//                       }`}
//                       onClick={() => {
//                         setSelectedImage(index);
//                         mainSlider.current?.slickGoTo(index);
//                       }}
//                     >
//                       <img
//                         src={img?.url || 'https://via.placeholder.com/500'}
//                         alt={`${product?.name || 'Product'} ${index + 1}`}
//                         className="w-full h-full object-cover rounded-sm"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="md:w-[40%] ml-6">
//           <div className="flex items-center gap-2 mb-3">
//             <StarIcon sx={{ fontSize: '16px', color: '#FFD700' }} />
//             <span className="text-black text-sm font-medium">
//               {(product.ratings || 0).toFixed(1)} star Rating{' '}
//               <span className="text-gray-500">({product.numOfReviews || 0} Reviews)</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="md:w-[40%] ml-6">
//         <div className="flex items-center gap-2 mb-3">
//           <StarIcon sx={{ fontSize: '16px', color: '#FFD700' }} />
//           <span className="text-black text-sm font-medium">
//             {(product.ratings || 0).toFixed(1)} star Rating{' '}
//             <span className="text-gray-500">({product.numOfReviews || 0} Reviews)</span>
//           </span>
//         </div>
//         <div className="mb-1 max-w-lg mb-6">
//           <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
//         </div>
//         <div className="mb-3">
//           <div className="flex items-baseline gap-3 mb-4">
//             <span className="text-2xl font-bold text-blue-800">
//               ₹{selectedUnit?.price?.toLocaleString() || product.price?.toLocaleString()}{" "}
//               {(selectedUnit?.cuttedPrice || product.cuttedPrice) && (
//                 <span className="text-gray-500 font-normal line-through text-lg ml-2">
//                   ₹{(selectedUnit?.cuttedPrice || product.cuttedPrice)?.toLocaleString()}
//                 </span>
//               )}
//             </span>
//             {((selectedUnit?.cuttedPrice && selectedUnit?.price && selectedUnit.cuttedPrice > selectedUnit.price) || 
//               (product.cuttedPrice && product.price && product.cuttedPrice > product.price)) && (
//               <span className="text-green-700 text-lg">
//                 {calculateDiscount(
//                   selectedUnit?.price || product.price, 
//                   selectedUnit?.cuttedPrice || product.cuttedPrice
//                 )}% off
//               </span>
//             )}
//           </div>
//           {/* Unit Selector */}
//           {product.orderConfig?.units?.length > 0 && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
//               <div className="flex flex-wrap gap-2">
//                 {product.orderConfig.units.map((unit) => (
//                   <button
//                     key={unit.unit}
//                     type="button"
//                     onClick={() => handleUnitChange({
//                       name: unit.unit,
//                       price: unit.price,
//                       cuttedPrice: unit.cuttedPrice || unit.price,
//                       minQty: unit.minQty || 1,
//                       maxQty: unit.maxQty,
//                       increment: unit.increment || 1
//                     })}
//                     className={`px-3 py-1.5 text-sm rounded-md border ${
//                       selectedUnit?.name === unit.unit
//                         ? 'bg-blue-50 border-blue-500 text-blue-700'
//                         : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
//                     }`}
//                   onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
//                   disabled={quantity <= 1}
//                   className="px-3 text-black font-bold disabled:opacity-80 disabled:cursor-not-allowed w-12 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l transition-colors"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4" />
//                   </svg>
//                 </button>
//                 <span className="flex-1 text-center font-medium" data-testid="quantity-display">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity((prev) => prev + 1)}
//                   className="px-3 text-black font-bold w-12 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r transition-colors"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="flex gap-3 w-full sm:w-auto">
//                 <button
//                   onClick={handleAddToCart}
//                   className="flex-1 py-3 px-6 bg-[#003366] text-white hover:bg-[#003366]/90 cursor-pointer transition-colors rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
//                 >
//                   ADD TO CART
//                 </button>
//                 <button
//                   onClick={handleBuyNow}
//                   className="flex-1 py-3 px-6 border border-[#003366] text-[#003366] hover:border-[#003366]/90 hover:text-[#003366]/90 hover:cursor-pointer transition-all rounded-lg font-medium text-sm shadow-sm whitespace-nowrap"
//                 >
//                   BUY NOW
//                 </button>
//               </div>
//             </div>
//             {/* Highlights */}
//             <div className="pt-4">
//               <h3 className="text-base font-large mb-2">Features</h3>
//               <ol className="text-sm space-y-1 list-disc ml-4">
//                 <li className="text-sm text-gray-800 mb-2">Processor: Apple M1 Chip</li>
//                 <li className="text-sm text-gray-800 mb-2">RAM: 8 GB</li>
//                 <li className="text-sm text-gray-800 mb-2">Storage: 256 GB</li>
//                 <li className="text-sm text-gray-800 mb-2">Display: 13-inch Retina Display</li>
//                 <li className="text-sm text-gray-800 mb-2">Camera: 12 MP</li>
//                 <li className="text-sm text-gray-800 mb-2">Weight: 1.3 lbs</li>
//               </ol>
//             </div>
//           </div>
//         </div>
//         <div className="w-[25%] ml-6">
//           <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
//             <h3 className="text-lg font-medium text-gray-800 mb-3">Want to buy bulk quantity?</h3>
//             <button className="w-full py-2 mb-2 bg-[#7BC363] text-white rounded-md text-sm font-medium transition-colors hover:cursor-pointer">
//               Chat on WhatsApp
//             </button>
//             <button
//               onClick={handleQuoteOpen}
//               className="w-full py-2 bg-[#003366] text-white rounded-md text-sm font-medium hover:bg-[#002b57] transition-colors hover:cursor-pointer"
//             >
//               Request a Quote
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabbed Description Section */}
//       <div className="w-full bg-white rounded-xl mt-6 p-6 border border-gray-200 overflow-auto">
//         <div className="flex justify-center border-b border-gray-200 mb-4">
//           <div className="flex">
//             {['description', 'additional information'].map((tab) => (
//               <div
//                 key={tab}
//                 className={`uppercase px-6 py-2 cursor-pointer text-sm ${
//                   activeTab === tab ? 'text-[#003366] border-b-4 border-[#003366] font-medium' : 'text-gray-600'
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1).replace(' ', '')}
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="bg-gray-100 rounded-lg shadow-sm p-6">
//           {activeTab === 'description' && (
//             <div>
//               <h2 className="text-xl font-semibold mb-5 text-gray-800">Description</h2>
//               <p className="text-gray-800 text-sm leading-relaxed">
//                 {product.description +
//                   ' The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. Add to that a stunning Liquid Retina XDR display, the best camera and audio ever in a Mac notebook, and all the ports you need. The first notebook of its kind, this MacBook Pro is a beast. M1 Pro takes the exceptional performance of the M1 architecture to a whole new level for users. Even the most ambitious projects are easily handled with up to 10 CPU cores, up to 16 GPU cores, a 16-core Neural Engine, and dedicated encode and decode media engines that support H.264, HEVC, and ProRes codecs.'}
//               </p>
//             </div>
//           )}
//           {activeTab === 'additional information' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Features Column */}
//               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-bold text-[#003366] mb-6 pb-3 border-b border-gray-200">Features</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0">
//                       <span>✓</span>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">Free 1 Year Warranty</h4>
//                       <p className="text-sm text-gray-600 mt-1">Comprehensive coverage for peace of mind</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0">
//                       <span>🚚</span>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">Fast & Free Delivery</h4>
//                       <p className="text-sm text-gray-600 mt-1">Quick shipping to your doorstep</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm flex-shrink-0">
//                       <span>🤝</span>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900">Money-back Guarantee</h4>
//                       <p className="text-sm text-gray-600 mt-1">100% satisfaction or your money back</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Shipping Info Column */}
//               <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//                 <h3 className="text-lg font-bold text-[#003366] mb-6 pb-3 border-b border-gray-200">Shipping Information</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//                     <span className="text-gray-700">Standard Shipping</span>
//                     <span className="font-medium text-gray-900">Free</span>
//                   </div>
//                   <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//                     <span className="text-gray-700">Express Shipping</span>
//                     <span className="font-medium text-gray-900">$19.00</span>
//                   </div>
//                   <div className="flex justify-between items-center pb-3 border-b border-gray-100">
//                     <span className="text-gray-700">Estimated Delivery</span>
//                     <span className="font-medium text-gray-900">2-4 business days</span>
//                   </div>
//                   <div className="pt-2">
//                     <p className="text-sm text-gray-600">Orders are processed and shipped within 24-48 hours during business days.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <div className="w-full mt-6 rounded-sm border flex flex-col">
//         <div className="flex justify-between items-center border-b px-6 py-4">
//           <h1 className="text-2xl font-medium">Ratings & Reviews</h1>
//           <button
//             onClick={handleDialogClose}
//             className="shadow bg-[#003366] text-white px-4 py-2 rounded-md hover:shadow-lg"
//             aria-label="Open review form"
//           >
//             Rate Product
//           </button>
//         </div>

//         <Dialog
//           aria-labelledby="review-dialog"
//           open={open}
//           onClose={handleDialogClose}
//         >
//           <DialogTitle className="border-b">Submit Review</DialogTitle>
//           <DialogContent className="flex flex-col m-1 gap-4">
//             <Rating
//               value={rating}
//               onChange={(e) => setRating(Number(e.target.value))}
//               size="large"
//               precision={0.5}
//               aria-label="Select rating"
//             />
//             <TextField
//               label="Your Review"
//               multiline
//               rows={3}
//               sx={{ width: 400 }}
//               size="small"
//               variant="outlined"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               error={rating === 0 || !comment.trim()}
//               helperText={rating === 0 || !comment.trim() ? 'Please provide both rating and comment' : ''}
//             />
//           </DialogContent>
//           <DialogActions>
//             <button
//               onClick={handleDialogClose}
//               className="py-2 px-6 rounded shadow bg-white border border-red-500 hover:bg-red-100 text-red-600 uppercase"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={reviewSubmitHandler}
//               className="py-2 px-6 rounded bg-green-600 hover:bg-green-700 text-white shadow uppercase"
//               disabled={isSubmittingReview}
//             >
//               {isSubmittingReview ? 'Submitting...' : 'Submit'}
//             </button>
//           </DialogActions>
//         </Dialog>

//         <div className="flex items-center border-b">
//           <h1 className="px-6 py-3 text-3xl font-semibold">
//             {product.ratings?.toFixed(1)} <StarIcon />
//           </h1>
//           <p className="text-lg text-gray-500">({product.numOfReviews || 0}) Reviews</p>
//         </div>

//         {product.reviews?.length > 0 ? (
//           viewAll
//             ? product.reviews
//                 .map((rev, i) => (
//                   <div className="flex flex-col gap-2 py-4 px-6 border-b" key={i}>
//                     <Rating
//                       name="read-only"
//                       value={rev.rating}
//                       readOnly
//                       size="small"
//                       precision={0.5}
//                     />
//                     <p>{rev.comment}</p>
//                     <span className="text-sm text-gray-500">by {rev.name}</span>
//                   </div>
//                 ))
//                 .reverse()
//             : product.reviews
//                 .slice(-3)
//                 .map((rev, i) => (
//                   <div className="flex flex-col gap-2 py-4 px-6 border-b" key={i}>
//                     <Rating
//                       name="read-only"
//                       value={rev.rating}
//                       readOnly
//                       size="small"
//                       precision={0.5}
//                     />
//                     <p>{rev.comment}</p>
//                     <span className="text-sm text-gray-500">by {rev.name}</span>
//                   </div>
//                 ))
//                 .reverse()
//         ) : (
//           <p className="px-6 py-4 text-gray-800 text-sm">No reviews yet.</p>
//         )}
//         {product.reviews?.length > 3 && (
//           <button
//             onClick={() => setViewAll(!viewAll)}
//             className="w-1/3 m-2 rounded-sm shadow hover:shadow-lg py-2 bg-[#003366] text-white"
//             aria-label={viewAll ? 'View less reviews' : 'View all reviews'}
//           >
//             {viewAll ? 'View Less' : 'View All'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsDG;