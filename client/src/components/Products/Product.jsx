import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { getDiscount } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';

const Product = ({ _id, name, images, ratings, numOfReviews, price, cuttedPrice }) => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    return (
        <motion.div 
            className="flex flex-col items-start gap-3 px-4 py-6 relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.02 }}
        >
            {/* <!-- image & product title --> */}
            <Link to={`/product/${_id}`} className="flex flex-col items-center text-center group">
                <div className="w-44 h-48 relative overflow-hidden rounded-lg">
                    <img 
                        draggable="false" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        src={images && images[0].url} 
                        alt="Product image"
                    />
                </div>
                <h2 className="text-base font-medium text-gray-900 group-hover:text-primary-blue transition-colors duration-200 text-left">{name.length > 85 ? `${name.substring(0, 85)}...` : name}</h2>
            </Link>
            {/* <!-- image & product title --> */}

            {/* <!-- product description --> */}
            <div className="flex flex-col gap-2 items-start">
                {/* <!-- rating badge --> */}
                <span className="text-sm text-gray-600 font-medium flex gap-2 items-center">
                    <span className="bg-primary-green px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">{ratings.toFixed(1)} <StarIcon sx={{ fontSize: "14px" }} /></span>
                    <span>({numOfReviews})</span>
                </span>
                {/* <!-- rating badge --> */}

                {/* <!-- price container --> */}
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className="text-2xl font-bold text-primary-blue">₹{price.toLocaleString()}</span>
                    <span className="text-gray-500 line-through text-base">₹{cuttedPrice.toLocaleString()}</span>
                    <span className="text-sm text-primary-green bg-primary-green/10 px-2 py-1 rounded-full">{getDiscount(price, cuttedPrice)}% off</span>
                </div>
                {/* <!-- price container --> */}
            </div>
            {/* <!-- product description --> */}

            {/* <!-- wishlist badge --> */}
            <motion.span 
                onClick={addToWishlistHandler} 
                className="absolute top-6 right-6 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FavoriteIcon 
                    sx={{ 
                        fontSize: "24px",
                        color: itemInWishlist ? "#ff4444" : "#888",
                        transition: "color 0.3s ease"
                    }} 
                />
            </motion.span>
            {/* <!-- wishlist badge --> */}

        </motion.div>
    );
};

export default Product;