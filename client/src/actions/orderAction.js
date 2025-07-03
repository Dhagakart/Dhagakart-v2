import axios from "axios";
import { 
    ALL_ORDERS_FAIL, 
    ALL_ORDERS_REQUEST, 
    ALL_ORDERS_SUCCESS, 
    CLEAR_ERRORS, 
    DELETE_ORDER_FAIL, 
    DELETE_ORDER_REQUEST, 
    DELETE_ORDER_SUCCESS, 
    MY_ORDERS_FAIL, 
    MY_ORDERS_REQUEST, 
    MY_ORDERS_SUCCESS, 
    NEW_ORDER_FAIL, 
    NEW_ORDER_REQUEST, 
    NEW_ORDER_SUCCESS, 
    ORDER_DETAILS_FAIL, 
    ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS, 
    PAYMENT_STATUS_FAIL, 
    PAYMENT_STATUS_REQUEST, 
    PAYMENT_STATUS_SUCCESS, 
    UPDATE_ORDER_FAIL, 
    UPDATE_ORDER_REQUEST, 
    UPDATE_ORDER_SUCCESS,
    SEARCH_ORDERS_REQUEST,
    SEARCH_ORDERS_SUCCESS,
    SEARCH_ORDERS_FAIL
} from "../constants/orderConstants";
import api from "../utils/api";
import { emptyCart } from './cartAction';
import { useNavigate } from 'react-router-dom';

// New Order
export const newOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch({ type: NEW_ORDER_REQUEST });

        const { user } = getState().user;
        const { cartItems, shippingInfo } = getState().cart;

        // Prepare order items with required fields
        const orderItems = cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item.product,
            seller: item.seller
        }));

        // Prepare complete order data
        const order = {
            shippingInfo: {
                ...shippingInfo,
                businessType: user.businessType || 'individual',
                businessName: user.businessName || `${user.firstName} ${user.lastName}`.trim() || 'Customer'
            },
            orderItems,
            paymentInfo: orderData.paymentInfo || {
                id: `mock_pay_${Date.now()}`,
                status: "succeeded"
            },
            itemsPrice: orderData.itemsPrice,
            taxPrice: orderData.taxPrice || 0,
            shippingPrice: orderData.shippingPrice || 0,
            totalPrice: orderData.totalPrice
        };

        const { data } = await api.post('/order/new', order);

        // Clear cart after successful order
        await dispatch(emptyCart());

        dispatch({
            type: NEW_ORDER_SUCCESS,
            payload: data,
        });

        // Return success status and order data
        return { success: true, data };

    } catch (error) {
        dispatch({
            type: NEW_ORDER_FAIL,
            payload: error.response?.data?.message || 'Error creating order',
        });
        throw error;
    }
};

// Get User Orders
export const myOrders = (page = 1) => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        const { data } = await api.get(`/orders/me?page=${page}`);
        console.log('Orders API Response:', data);
        
        // Use the orders array from the response
        const orders = data.orders || [];
        
        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: {
                orders,
                currentPage: data.currentPage || page,
                totalPages: data.totalPages || 1,
                totalOrders: data.totalOrders || orders.length
            }
        });

    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response?.data?.message || 'Error fetching orders'
        });
    }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const { data } = await api.get(`/order/${id}`);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order,
        });

        return data.order;
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response?.data?.message || 'Failed to fetch order details',
        });
        throw error;
    }
};

// Get Payment Status
export const getPaymentStatus = (id) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_STATUS_REQUEST });

        const { data } = await api.get(`/payment/status/${id}`);

        dispatch({
            type: PAYMENT_STATUS_SUCCESS,
            payload: data.txn,
        })

    } catch (error) {
        dispatch({
            type: PAYMENT_STATUS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Orders ---ADMIN
export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });

        const { data } = await api.get('/admin/orders');

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data.orders,
        })

    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update Order ---ADMIN
export const updateOrder = (id, order) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await api.put(`/admin/order/${id}`, order, config);

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete Order ---ADMIN
export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });

        const { data } = await api.delete(`/admin/order/${id}`);

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success,
        })

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Search Orders with Filters
export const searchOrders = (filters) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_ORDERS_REQUEST });

        // Convert filters to query string
        const queryString = Object.entries(filters)
            .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const { data } = await api.get(`/admin/orders/search?${queryString}`);

        dispatch({
            type: SEARCH_ORDERS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: SEARCH_ORDERS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};