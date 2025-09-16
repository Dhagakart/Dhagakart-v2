// import {
//     NEW_ORDER_REQUEST, NEW_ORDER_SUCCESS, NEW_ORDER_FAIL,
//     CLEAR_ERRORS,
//     MY_ORDERS_FAIL, MY_ORDERS_SUCCESS, MY_ORDERS_REQUEST,
//     PAYMENT_STATUS_REQUEST, PAYMENT_STATUS_SUCCESS, PAYMENT_STATUS_FAIL,
//     ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL,
//     ALL_ORDERS_REQUEST, ALL_ORDERS_SUCCESS, ALL_ORDERS_FAIL,
//     UPDATE_ORDER_REQUEST, DELETE_ORDER_REQUEST,
//     UPDATE_ORDER_SUCCESS, DELETE_ORDER_SUCCESS,
//     UPDATE_ORDER_FAIL, DELETE_ORDER_FAIL,
//     UPDATE_ORDER_RESET, DELETE_ORDER_RESET,
//     SEARCH_ORDERS_REQUEST, SEARCH_ORDERS_SUCCESS, SEARCH_ORDERS_FAIL,
//     NEW_ORDER_RECEIVED,
//     MY_SAMPLE_ORDERS_REQUEST,
//     MY_SAMPLE_ORDERS_SUCCESS,
//     MY_SAMPLE_ORDERS_FAIL, // <-- Import the new constant
//     ORDER_SHIPPING_DETAILS_REQUEST,
//     ORDER_SHIPPING_DETAILS_SUCCESS,
//     ORDER_SHIPPING_DETAILS_FAIL,
//     CLEAR_ERRORS,
// } from "../constants/orderConstants";

// export const newOrderReducer = (state = {}, { type, payload }) => {
//     switch (type) {
//         case NEW_ORDER_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//             };
//         case NEW_ORDER_SUCCESS:
//             return {
//                 loading: false,
//                 order: payload,
//             };
//         case NEW_ORDER_FAIL:
//             return {
//                 loading: false,
//                 error: payload,
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };
//         default:
//             return state;
//     }
// };

// export const myOrdersReducer = (state = { orders: [], pagination: {} }, { type, payload }) => {
//     switch (type) {
//         case MY_ORDERS_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//                 error: null
//             };
//         case MY_ORDERS_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 orders: payload.orders || [],
//                 pagination: {
//                     currentPage: parseInt(payload.currentPage) || 1,
//                     totalPages: parseInt(payload.totalPages) || 1,
//                     totalOrders: parseInt(payload.totalOrders) || 0
//                 },
//                 error: null
//             };
//         case MY_ORDERS_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: payload,
//                 orders: [],
//                 pagination: {}
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null
//             };
//         default:
//             return state;
//     }
// };

// export const paymentStatusReducer = (state = { txn: {} }, { type, payload }) => {
//     switch (type) {
//         case PAYMENT_STATUS_REQUEST:
//             return {
//                 loading: true,
//             };
//         case PAYMENT_STATUS_SUCCESS:
//             return {
//                 loading: false,
//                 txn: payload,
//             };
//         case PAYMENT_STATUS_FAIL:
//             return {
//                 loading: false,
//                 error: payload,
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };
//         default:
//             return state;
//     }
// };

// export const orderDetailsReducer = (state = { order: {} }, { type, payload }) => {
//     switch (type) {
//         case ORDER_DETAILS_REQUEST:
//             return {
//                 loading: true,
//             };
//         case ORDER_DETAILS_SUCCESS:
//             return {
//                 loading: false,
//                 order: payload,
//             };
//         case ORDER_DETAILS_FAIL:
//             return {
//                 loading: false,
//                 error: payload,
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };
//         default:
//             return state;
//     }
// };


// export const allOrdersReducer = (state = {
//     orders: [],
//     totalOrders: 0,
//     totalAmount: 0,
//     totalPages: 1,
//     currentPage: 1,
//     limit: 10,
//     loading: false,
//     error: null
// }, { type, payload }) => {
//     switch (type) {
//         case ALL_ORDERS_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//                 error: null
//             };

//         case ALL_ORDERS_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 orders: Array.isArray(payload.orders) ? payload.orders : [],
//                 totalOrders: payload.totalOrders || 0,
//                 totalAmount: payload.totalAmount || 0,
//                 totalPages: payload.totalPages || 1,
//                 currentPage: payload.currentPage || 1,
//                 limit: payload.limit || (Array.isArray(payload.orders) ? payload.orders.length : 10)
//             };

//         // --- ADD THIS CASE FOR REAL-TIME UPDATES ---
//         case NEW_ORDER_RECEIVED:
//             return {
//                 ...state,
//                 // Add the new order to the beginning of the existing list
//                 orders: [payload, ...state.orders],
//                 // Increment the total order count
//                 totalOrders: state.totalOrders + 1,
//             };
//         // ---------------------------------------------

//         case ALL_ORDERS_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: payload,
//                 orders: [],
//                 totalOrders: 0,
//                 totalAmount: 0
//             };

//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };

//         default:
//             return state;
//     }
// };

// export const searchOrdersReducer = (state = { orders: [], pagination: {} }, { type, payload }) => {
//     switch (type) {
//         case SEARCH_ORDERS_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//                 error: null
//             };

//         case SEARCH_ORDERS_SUCCESS:
//             const orders = Array.isArray(payload) ? payload : (payload.orders || []);
//             const pagination = {
//                 currentPage: payload.currentPage || 1,
//                 totalPages: payload.totalPages || 1,
//                 totalOrders: payload.totalOrders || (Array.isArray(payload) ? payload.length : 0)
//             };
            
//             return {
//                 ...state,
//                 loading: false,
//                 orders,
//                 pagination,
//                 error: null
//             };

//         case SEARCH_ORDERS_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: payload,
//                 orders: [],
//                 pagination: {}
//             };

//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null
//             };

//         default:
//             return state;
//     }
// };

// export const orderReducer = (state = {}, { type, payload }) => {
//     switch (type) {
//         case UPDATE_ORDER_REQUEST:
//         case DELETE_ORDER_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//             };
//         case UPDATE_ORDER_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 isUpdated: payload,
//             };
//         case DELETE_ORDER_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 isDeleted: payload,
//             };
//         case UPDATE_ORDER_FAIL:
//         case DELETE_ORDER_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: payload,
//             };
//         case UPDATE_ORDER_RESET:
//             return {
//                 ...state,
//                 isUpdated: false,
//             };
//         case DELETE_ORDER_RESET:
//             return {
//                 ...state,
//                 isDeleted: false,
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };
//         default:
//             return state;
//     }
// };


// export const mySampleOrdersReducer = (state = { orders: [] }, { type, payload }) => {
//     switch (type) {
//         case MY_SAMPLE_ORDERS_REQUEST:
//             return {
//                 loading: true,
//             };
//         case MY_SAMPLE_ORDERS_SUCCESS:
//             return {
//                 loading: false,
//                 orders: payload.orders,
//                 pagination: {
//                     currentPage: payload.currentPage,
//                     totalPages: payload.totalPages,
//                     totalOrders: payload.totalOrders,
//                 }
//             };
//         case MY_SAMPLE_ORDERS_FAIL:
//             return {
//                 loading: false,
//                 error: payload,
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };
//         default:
//             return state;
//     }
// };
import {
    ALL_ORDERS_FAIL, ALL_ORDERS_REQUEST, ALL_ORDERS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_ORDER_FAIL, DELETE_ORDER_REQUEST, DELETE_ORDER_RESET, DELETE_ORDER_SUCCESS,
    MY_ORDERS_FAIL, MY_ORDERS_REQUEST, MY_ORDERS_SUCCESS,
    NEW_ORDER_FAIL, NEW_ORDER_REQUEST, NEW_ORDER_SUCCESS,
    ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS,
    ORDER_SHIPPING_DETAILS_REQUEST, ORDER_SHIPPING_DETAILS_SUCCESS, ORDER_SHIPPING_DETAILS_FAIL,
    UPDATE_ORDER_FAIL, UPDATE_ORDER_REQUEST, UPDATE_ORDER_RESET, UPDATE_ORDER_SUCCESS,
    NEW_SAMPLE_ORDER_REQUEST, NEW_SAMPLE_ORDER_SUCCESS, NEW_SAMPLE_ORDER_FAIL,
    MY_SAMPLE_ORDERS_REQUEST, MY_SAMPLE_ORDERS_SUCCESS, MY_SAMPLE_ORDERS_FAIL,
    PAYMENT_STATUS_REQUEST, PAYMENT_STATUS_SUCCESS, PAYMENT_STATUS_FAIL,
    SEARCH_ORDERS_REQUEST, SEARCH_ORDERS_SUCCESS, SEARCH_ORDERS_FAIL,
} from "../constants/orderConstants";

export const newOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_ORDER_REQUEST:
        case NEW_SAMPLE_ORDER_REQUEST:
            return { ...state, loading: true };
        case NEW_ORDER_SUCCESS:
        case NEW_SAMPLE_ORDER_SUCCESS:
            return { loading: false, order: action.payload };
        case NEW_ORDER_FAIL:
        case NEW_SAMPLE_ORDER_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case MY_ORDERS_REQUEST:
            return { loading: true, orders: [] };
        case MY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                totalOrders: action.payload.totalOrders,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
            };
        case MY_ORDERS_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const mySampleOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case MY_SAMPLE_ORDERS_REQUEST:
            return { loading: true, orders: [] };
        case MY_SAMPLE_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                totalOrders: action.payload.totalOrders,
                totalPages: action.payload.totalPages,
                currentPage: action.payload.currentPage,
            };
        case MY_SAMPLE_ORDERS_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const allOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ALL_ORDERS_REQUEST:
            return { loading: true };
        case ALL_ORDERS_SUCCESS:
            return { loading: false, orders: action.payload.orders, totalAmount: action.payload.totalAmount };
        case ALL_ORDERS_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const orderReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
            return { ...state, loading: true };
        case UPDATE_ORDER_SUCCESS:
            return { ...state, loading: false, isUpdated: action.payload };
        case DELETE_ORDER_SUCCESS:
            return { ...state, loading: false, isDeleted: action.payload };
        case UPDATE_ORDER_FAIL:
        case DELETE_ORDER_FAIL:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_ORDER_RESET:
            return { ...state, isUpdated: false };
        case DELETE_ORDER_RESET:
            return { ...state, isDeleted: false };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
        case ORDER_SHIPPING_DETAILS_REQUEST:
            return { ...state, loading: true };
        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload };
        case ORDER_SHIPPING_DETAILS_SUCCESS:
            return { ...state, loading: false, shippingDetails: action.payload };
        case ORDER_DETAILS_FAIL:
        case ORDER_SHIPPING_DETAILS_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const paymentStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case PAYMENT_STATUS_REQUEST:
            return { loading: true };
        case PAYMENT_STATUS_SUCCESS:
            return { loading: false, txn: action.payload };
        case PAYMENT_STATUS_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const searchOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case SEARCH_ORDERS_REQUEST:
            return { loading: true };
        case SEARCH_ORDERS_SUCCESS:
            return { loading: false, ...action.payload };
        case SEARCH_ORDERS_FAIL:
            return { loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};