import axios from 'axios';
import { 
    CLEAR_ERRORS, 
    GET_RECENT_ORDERS_REQUEST, 
    GET_RECENT_ORDERS_SUCCESS, 
    GET_RECENT_ORDERS_FAIL, 
    ADD_TRACKING_EVENT_REQUEST, 
    ADD_TRACKING_EVENT_SUCCESS, 
    ADD_TRACKING_EVENT_FAIL, 
    ADD_TRACKING_EVENT_RESET,
    GET_USER_RECENT_ORDERS_REQUEST,
    GET_USER_RECENT_ORDERS_SUCCESS,
    GET_USER_RECENT_ORDERS_FAIL 
} from '../constants/orderConstants';

// Get Admin Recent Orders
export const getRecentOrders = (limit = 5, days = 30) => async (dispatch) => {
    try {
        dispatch({ type: GET_RECENT_ORDERS_REQUEST });

        const { data } = await axios.get(`/api/v1/orders/recent?limit=${limit}&days=${days}`);

        dispatch({
            type: GET_RECENT_ORDERS_SUCCESS,
            payload: data.orders
        });
    } catch (error) {
        dispatch({
            type: GET_RECENT_ORDERS_FAIL,
            payload: error.response?.data?.message || 'Error fetching recent orders'
        });
    }
};

// Get User's Recent Orders with Tracking
export const getUserRecentOrders = (limit = 5, days = 30) => async (dispatch) => {
    try {
        dispatch({ type: GET_USER_RECENT_ORDERS_REQUEST });

        const { data } = await axios.get(`/api/v1/orders/recent?limit=${limit}&days=${days}`);

        dispatch({
            type: GET_USER_RECENT_ORDERS_SUCCESS,
            payload: data.orders
        });
    } catch (error) {
        dispatch({
            type: GET_USER_RECENT_ORDERS_FAIL,
            payload: error.response?.data?.message || 'Error fetching your recent orders'
        });
    }
};

// Add Tracking Event
export const addTrackingEvent = (orderId, trackingData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_TRACKING_EVENT_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(
            `/api/v1/order/${orderId}/tracking`,
            trackingData,
            config
        );

        dispatch({
            type: ADD_TRACKING_EVENT_SUCCESS,
            payload: data.trackingEvent
        });

        // Refresh the recent orders after adding a tracking event
        dispatch(getRecentOrders());
    } catch (error) {
        dispatch({
            type: ADD_TRACKING_EVENT_FAIL,
            payload: error.response?.data?.message || 'Error adding tracking event'
        });
    }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
