import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getDiscount } from '../../utils/functions';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import StarRating from '../Common/StarRating';

const Product = ({ _id, name, images, ratings, numOfReviews, price, cuttedPrice }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const { wishlistItems } = useSelector((state) => state.wishlist);
    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = (e) => {
        e.stopPropagation(); 
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Removed From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }
    
    const isComingSoon = name !== 'Spun Viscose Yarn 30s – Soft Finish';

    return (
        // The onClick and className have been simplified to always be active
        <div 
            className="flex flex-col items-center justify-center gap-2 py-2 md:px-4 px-2 relative rounded-lg border border-gray-200 overflow-hidden hover:cursor-pointer"
            onClick={() => navigate(`/product/${_id}`)}
        >
            
            {isComingSoon && (
                <div className="absolute top-6 -right-9 w-32 text-center transform rotate-45 bg-[#003366] text-white text-[10px] font-bold py-0.5 shadow-md z-10">
                    Coming Soon
                </div>
            )}
            
            {/* image & product title */}
            <div className="md:w-48 md:h-48 w-34 h-34 flex items-center justify-center">
                <img draggable="false" className="md:w-full md:h-full w-32 h-32 object-contain" src={images && images[0].url} alt={name} />
            </div>

            {/* product description */}
            <div className="flex flex-col gap-2 items-start w-full">
                {/* rating badge */}
                <div className="flex items-start gap-1.5 mt-1">
                    <StarRating rating={ratings} starSize="w-4 h-4" showText={false} />
                    <span className="text-xs text-gray-500">({numOfReviews})</span>
                </div>

                <h2 className="text-sm h-12 mt-4 text-start">{name.length > 55 ? `${name.substring(0, 55)}...` : name}</h2>

                {/* price container */}
                <div className="flex items-center gap-1.5 text-md font-medium">
                    <span className='text-[#003366]'>₹{price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-md font-medium">
                    <span className="text-gray-500 line-through text-xs">₹{cuttedPrice.toLocaleString()}</span>
                    <span className="text-xs text-green-500">{getDiscount(price, cuttedPrice)}%&nbsp;off</span>
                </div>
            </div>

        </div>
    );
};

export default Product;