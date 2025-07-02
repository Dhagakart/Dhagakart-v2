import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { getDiscount } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { useSnackbar } from 'notistack';
import StarRating from '../Common/StarRating';
import { useNavigate } from 'react-router-dom';

// const Product = ({ _id, name, images, ratings, numOfReviews, price, cuttedPrice }) => {
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

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center gap-2 mx-2 py-2 px-4 relative border border-gray-200 rounded-lg hover:cursor-pointer" onClick={() => navigate(`/product/${_id}`)}>
            {/* <!-- image & product title --> */}
            {/* <Link to={`/product/${_id}`} className="flex flex-col justify-center items-center text-center"> */}
            <div className="w-48 h-48">
                <img draggable="false" className="w-full h-full object-contain" src={images && images[0].url} alt="" />
            </div>
            {/* </Link> */}
            {/* <!-- image & product title --> */}

            {/* <!-- product description --> */}
            <div className="flex flex-col gap-2 items-start">
                {/* <!-- rating badge --> */}
                <div className="flex items-start gap-1.5 mt-1">
                    {/* <div className="flex items-center bg-green-700 text-white text-xs px-1.5 py-0.5 rounded">
                        <span className="font-medium">{ratings.toFixed(1)}</span>
                        <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div> */}
                    <StarRating rating={ratings} starSize="w-4 h-4" showText={false} />
                    <span className="text-xs text-gray-500">({numOfReviews})</span>
                </div>
                {/* <!-- rating badge --> */}

                {/* <h2 className="text-sm mt-4 text-center">{name.length > 85 ? `${name.substring(0, 85)}...` : name}</h2> */}
                <h2 className="text-sm mt-4 text-start">{name.length > 65 ? `${name.substring(0, 65)}...` : name}</h2>

                {/* <!-- price container --> */}
                <div className="flex items-center gap-1.5 text-md font-medium">
                    <span className='text-[#003366]'>₹{cuttedPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-md font-medium">
                    <span className="text-gray-500 line-through text-xs">₹{price.toLocaleString()}</span>
                    <span className="text-xs text-green-500">{getDiscount(price, cuttedPrice)}%&nbsp;off</span>
                </div>
                {/* <!-- price container --> */}
            </div>
            {/* <!-- product description --> */}

            {/* <!-- wishlist badge --> */}
            {/* <span onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-gray-300"} absolute top-6 right-6 cursor-pointer`}><FavoriteIcon sx={{ fontSize: "18px" }} /></span> */}
            {/* <!-- wishlist badge --> */}

        </div>
    );
};

export default Product;