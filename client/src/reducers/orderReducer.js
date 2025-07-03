import { 
    NEW_ORDER_REQUEST, NEW_ORDER_SUCCESS, NEW_ORDER_FAIL, 
    CLEAR_ERRORS, 
    MY_ORDERS_FAIL, MY_ORDERS_SUCCESS, MY_ORDERS_REQUEST, 
    PAYMENT_STATUS_REQUEST, PAYMENT_STATUS_SUCCESS, PAYMENT_STATUS_FAIL, 
    ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_FAIL, 
    ALL_ORDERS_REQUEST, ALL_ORDERS_SUCCESS, ALL_ORDERS_FAIL, 
    UPDATE_ORDER_REQUEST, DELETE_ORDER_REQUEST, 
    UPDATE_ORDER_SUCCESS, DELETE_ORDER_SUCCESS, 
    UPDATE_ORDER_FAIL, DELETE_ORDER_FAIL, 
    UPDATE_ORDER_RESET, DELETE_ORDER_RESET,
    SEARCH_ORDERS_REQUEST, SEARCH_ORDERS_SUCCESS, SEARCH_ORDERS_FAIL
} from "../constants/orderConstants";

export const newOrderReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case NEW_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case NEW_ORDER_SUCCESS:
            return {
                loading: false,
                order: payload,
            };
        case NEW_ORDER_FAIL:
            return {
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const myOrdersReducer = (state = { orders: [], pagination: {} }, { type, payload }) => {
    switch (type) {
        case MY_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case MY_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: payload.orders || [],
                pagination: {
                    currentPage: parseInt(payload.currentPage) || 1,
                    totalPages: parseInt(payload.totalPages) || 1,
                    totalOrders: parseInt(payload.totalOrders) || 0
                },
                error: null
            };
        case MY_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                orders: [],
                pagination: {}
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const paymentStatusReducer = (state = { txn: {} }, { type, payload }) => {
    switch (type) {
        case PAYMENT_STATUS_REQUEST:
            return {
                loading: true,
            };
        case PAYMENT_STATUS_SUCCESS:
            return {
                loading: false,
                txn: payload,
            };
        case PAYMENT_STATUS_FAIL:
            return {
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const orderDetailsReducer = (state = { order: {} }, { type, payload }) => {
    switch (type) {
        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
            };
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: payload,
            };
        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};


export const allOrdersReducer = (state = { 
    orders: [], 
    totalOrders: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
}, { type, payload }) => {
    switch (type) {
        case ALL_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case ALL_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: Array.isArray(payload.orders) ? payload.orders : [],
                totalOrders: payload.totalOrders || 0,
                totalPages: payload.totalPages || 1,
                currentPage: payload.currentPage || 1,
                limit: payload.limit || 10
            };
            
        case ALL_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                orders: []
            };
            
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
            
        default:
            return state;
    }
};

export const searchOrdersReducer = (state = { orders: [], pagination: {} }, { type, payload }) => {
    switch (type) {
        case SEARCH_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case SEARCH_ORDERS_SUCCESS:
            // Handle both direct array response and paginated response
            const orders = Array.isArray(payload) ? payload : (payload.orders || []);
            const pagination = {
                currentPage: payload.currentPage || 1,
                totalPages: payload.totalPages || 1,
                totalOrders: payload.totalOrders || (Array.isArray(payload) ? payload.length : 0)
            };
            
            return {
                ...state,
                loading: false,
                orders,
                pagination,
                error: null
            };

        case SEARCH_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
                orders: [],
                pagination: {}
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export const orderReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: payload,
            };
        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: payload,
            };
        case UPDATE_ORDER_FAIL:
        case DELETE_ORDER_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case UPDATE_ORDER_RESET:
            return {
                ...state,
                isUpdated: false,
            };
        case DELETE_ORDER_RESET:
            return {
                ...state,
                isDeleted: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};