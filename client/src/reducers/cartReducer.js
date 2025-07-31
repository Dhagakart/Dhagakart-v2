import { 
    ADD_TO_CART, 
    EMPTY_CART, 
    REMOVE_FROM_CART, 
    SAVE_SHIPPING_INFO,
    // --- MODIFICATION: Import sample cart constants ---
    ADD_TO_SAMPLE_CART,
    REMOVE_FROM_SAMPLE_CART,
    EMPTY_SAMPLE_CART,
    SAVE_SAMPLE_SHIPPING_INFO,
} from "../constants/cartConstants";

// --- Reducer for the Regular Shopping Cart ---

const initialState = {
    cartItems: localStorage.getItem('cartItems') 
        ? JSON.parse(localStorage.getItem('cartItems')) 
        : [],
    shippingInfo: localStorage.getItem('shippingInfo') 
        ? JSON.parse(localStorage.getItem('shippingInfo'))
        : {}
};

export const cartReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ADD_TO_CART:
            const item = payload;
            const isItemExist = state.cartItems.find((el) => el.product === item.product);

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((el) =>
                        el.product === isItemExist.product ? item : el
                    ),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter((el) => el.product !== payload)
            }
        case EMPTY_CART:
            return {
                ...state,
                cartItems: [],
            }
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: payload
            };
        default:
            return state;
    }
};

// --- MODIFICATION: Added Reducer for the Sample Cart ---

const initialSampleState = {
    sampleCartItems: localStorage.getItem('sampleCartItems') 
        ? JSON.parse(localStorage.getItem('sampleCartItems')) 
        : [],
    sampleShippingInfo: localStorage.getItem('sampleShippingInfo') 
        ? JSON.parse(localStorage.getItem('sampleShippingInfo'))
        : {}
};

export const sampleCartReducer = (state = initialSampleState, { type, payload }) => {
    switch (type) {
        case ADD_TO_SAMPLE_CART:
            const item = payload;
            const isItemExist = state.sampleCartItems.find((el) => el.product === item.product);

            if (isItemExist) {
                return {
                    ...state,
                    sampleCartItems: state.sampleCartItems.map((el) =>
                        el.product === isItemExist.product ? item : el
                    ),
                }
            } else {
                return {
                    ...state,
                    sampleCartItems: [...state.sampleCartItems, item],
                }
            }
        case REMOVE_FROM_SAMPLE_CART:
            return {
                ...state,
                sampleCartItems: state.sampleCartItems.filter((el) => el.product !== payload)
            }
        case EMPTY_SAMPLE_CART:
            return {
                ...state,
                sampleCartItems: [],
            }
        case SAVE_SAMPLE_SHIPPING_INFO:
            return {
                ...state,
                sampleShippingInfo: payload
            };
        default:
            return state;
    }
};