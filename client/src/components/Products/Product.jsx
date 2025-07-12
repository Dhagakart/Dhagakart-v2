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
        <div className="flex flex-col items-center justify-center gap-2 py-2 md:px-4 px-2 relative  rounded-lg hover:cursor-pointer" onClick={() => navigate(`/product/${_id}`)}>
            {/* <!-- image & product title --> */}
            {/* <Link to={/product/${_id}} className="flex flex-col justify-center items-center text-center"> */}
            <div className="md:w-48 md:h-48 w-34 h-34 flex items-center justify-center">
                <img draggable="false" className="md:w-full md:h-full w-32 h-32 object-contain" src={images && images[0].url} alt="" />
            </div>
            {/* </Link> */}
            {/* <!-- image & product title --> */}

            {/* <!-- product description --> */}
            <div className="flex flex-col gap-2 items-start">
                {/* <!-- rating badge --> */}
                <div className="flex items-start gap-1.5 mt-1">
                    <StarRating rating={ratings} starSize="w-4 h-4" showText={false} />
                    <span className="text-xs text-gray-500">({numOfReviews})</span>
                </div>
                {/* <!-- rating badge --> */}

                <h2 className="text-sm h-12 mt-4 text-start">{name.length > 55 ? `${name.substring(0, 55)}...` : name}</h2>

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