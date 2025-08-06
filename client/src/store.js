import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { forgotPasswordReducer, profileReducer, userReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducer';
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer, productReviewsReducer, reviewReducer } from './reducers/productReducer';
import { cartReducer, sampleCartReducer } from './reducers/cartReducer';
import { saveForLaterReducer } from './reducers/saveForLaterReducer';
import { allOrdersReducer, myOrdersReducer, mySampleOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer, paymentStatusReducer, searchOrdersReducer } from './reducers/orderReducer';
import { wishlistReducer } from './reducers/wishlistReducer';
import { quoteListReducer, quoteDetailsReducer, newQuoteReducer } from './reducers/quoteReducer';

const reducer = combineReducers({
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    products: productsReducer,
    productDetails: productDetailsReducer,
    newReview: newReviewReducer,
    cart: cartReducer,
    sampleCart: sampleCartReducer,
    saveForLater: saveForLaterReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    mySampleOrders: mySampleOrdersReducer,
    paymentStatus: paymentStatusReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    searchOrders: searchOrdersReducer,
    newProduct: newProductReducer,
    product: productReducer,
    users: allUsersReducer,
    userDetails: userDetailsReducer,
    reviews: productReviewsReducer,
    review: reviewReducer,
    wishlist: wishlistReducer,
    quoteList: quoteListReducer,
    quoteDetails: quoteDetailsReducer,
    newQuote: newQuoteReducer,
});

// --- MODIFICATION: Added initial state for myOrders and mySampleOrders ---
let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
    sampleCart: {
        sampleCartItems: localStorage.getItem('sampleCartItems')
            ? JSON.parse(localStorage.getItem('sampleCartItems'))
            : [],
        sampleShippingInfo: localStorage.getItem("sampleShippingInfo")
            ? JSON.parse(localStorage.getItem("sampleShippingInfo"))
            : {},
    },
    saveForLater: {
        saveForLaterItems: localStorage.getItem('saveForLaterItems')
            ? JSON.parse(localStorage.getItem('saveForLaterItems'))
            : [],
    },
    wishlist: {
        wishlistItems: localStorage.getItem('wishlistItems')
            ? JSON.parse(localStorage.getItem('wishlistItems'))
            : [],
    },
    // Add these to ensure they are never undefined
    myOrders: {
        orders: [],
        pagination: {}
    },
    mySampleOrders: {
        orders: [],
        pagination: {}
    }
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
