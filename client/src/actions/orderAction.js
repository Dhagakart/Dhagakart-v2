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
// Get All Orders Without Pagination ---ADMIN
export const getAllOrdersWithoutPagination = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });
        
        console.log('Fetching all orders without pagination');
        
        const { data } = await axios.get('/api/v1/admin/orders/all');
        console.log('API Response Data:', data);
        
        // Ensure we have the expected data structure
        const orders = Array.isArray(data.orders) ? data.orders : [];
        const totalAmount = data.totalAmount || 0;
        const totalOrders = data.totalOrders || orders.length;
        
        console.log('Processed Orders Data:', { 
            ordersCount: orders.length,
            totalOrders,
            totalAmount 
        });
        
        // Prepare the payload for the reducer
        const payload = {
            orders,
            totalAmount,
            totalOrders,
            totalPages: 1,
            currentPage: 1,
            limit: totalOrders,
            count: totalOrders
        };
        
        console.log('Dispatching with payload:', payload);
        
        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload
        });
        
        return orders; // Return the orders for the component to use
    } catch (error) {
        console.error('Error fetching all orders:', {
            error,
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch all orders';
        
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: errorMessage,
        });
        
        // Re-throw the error to be caught by the component
        throw new Error(errorMessage);
    }
};

// Get All Orders With Pagination ---ADMIN
export const getAllOrders = ({ page = 1, limit = 10, sortBy = '-createdAt' } = {}) => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });
        
        console.log('Fetching all orders with:', { page, limit, sortBy });
        
        const queryParams = new URLSearchParams({
            page,
            limit,
            sortBy
        }).toString();
        
        const url = `/admin/orders?${queryParams}`;
        console.log('API URL:', url);
        
        const { data } = await api.get(url);
        
        console.log('Orders API response:', {
            ordersCount: data.orders?.length || 0,
            pagination: data.pagination
        });

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: {
                orders: data.orders || [],
                totalOrders: data.pagination?.totalOrders || 0,
                totalPages: data.pagination?.totalPages || 1,
                currentPage: data.pagination?.currentPage || 1
            },
        });
        
        return data; // Return the data for potential use in components

    } catch (error) {
        console.error('Error fetching orders:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
        
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: errorMessage,
        });
        
        // Re-throw the error to be caught by the component
        throw new Error(errorMessage);
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
        
        // Convert filters to query string with proper handling of dates and objects
        const queryString = Object.entries(filters)
            .filter(([_, value]) => {
                // Filter out empty strings, null, and undefined
                if (value === '' || value === null || value === undefined) {
                    return false;
                }
                // Filter out empty objects and arrays
                if (typeof value === 'object' && Object.keys(value).length === 0) {
                    return false;
                }
                return true;
            })
            .map(([key, value]) => {
                // Handle date objects
                if (value instanceof Date) {
                    return `${key}=${encodeURIComponent(value.toISOString())}`;
                }
                // Handle nested objects (like shippingInfo)
                if (typeof value === 'object' && value !== null) {
                    return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
                }
                return `${key}=${encodeURIComponent(value)}`;
            })
            .join('&');

        console.log('Making API request to:', `/admin/orders/search?${queryString}`);
        const response = await api.get(`/admin/orders/search?${queryString}`);
        console.log('Search API response:', response.data);

        dispatch({
            type: SEARCH_ORDERS_SUCCESS,
            payload: response.data
        });
        
        return response.data; // Return the data for potential use in components
    } catch (error) {
        console.error('Search orders error:', error);
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || error.message || 'Failed to search orders';
        
        dispatch({
            type: SEARCH_ORDERS_FAIL,
            payload: errorMessage
        });
        
        // Re-throw the error to be caught by the component
        throw new Error(errorMessage);
    }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};