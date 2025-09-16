import {
    GET_RECENT_ORDERS_REQUEST,
    GET_RECENT_ORDERS_SUCCESS,
    GET_RECENT_ORDERS_FAIL,
    GET_USER_RECENT_ORDERS_REQUEST,
    GET_USER_RECENT_ORDERS_SUCCESS,
    GET_USER_RECENT_ORDERS_FAIL,
    ADD_TRACKING_EVENT_REQUEST,
    ADD_TRACKING_EVENT_SUCCESS,
    ADD_TRACKING_EVENT_FAIL,
    ADD_TRACKING_EVENT_RESET,
    CLEAR_ERRORS
} from '../constants/orderConstants';

// Initial state for recent orders
const initialState = {
    orders: [],
    userOrders: [],
    loading: false,
    error: null,
    success: false,
    trackingEvent: null
};

export const recentOrdersReducer = (state = initialState, action) => {
    switch (action.type) {
        // Admin recent orders
        case GET_RECENT_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        
        case GET_RECENT_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: null
            };
        
        case GET_RECENT_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                orders: []
            };

        // User recent orders with tracking
        case GET_USER_RECENT_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        
        case GET_USER_RECENT_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                userOrders: action.payload,
                error: null
            };
        
        case GET_USER_RECENT_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                userOrders: []
            };
        
        // Tracking events
        case ADD_TRACKING_EVENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        
        case ADD_TRACKING_EVENT_SUCCESS:
            // Update the specific order in userOrders with the new tracking event
            const updatedUserOrders = state.userOrders.map(order => 
                order._id === action.payload.orderId
                    ? {
                        ...order,
                        trackingEvents: [...(order.trackingEvents || []), action.payload.trackingEvent]
                    }
                    : order
            );

            return {
                ...state,
                loading: false,
                success: true,
                trackingEvent: action.payload.trackingEvent,
                userOrders: updatedUserOrders,
                error: null
            };
        
        case ADD_TRACKING_EVENT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        
        case ADD_TRACKING_EVENT_RESET:
            return {
                ...state,
                loading: false,
                error: null,
                success: false,
                trackingEvent: null
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

// Tracking event functionality has been integrated into the main recentOrdersReducer
