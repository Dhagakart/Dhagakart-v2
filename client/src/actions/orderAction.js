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
    SEARCH_ORDERS_FAIL,
    // --- MODIFICATION: Import sample order constants ---
    NEW_SAMPLE_ORDER_REQUEST,
    NEW_SAMPLE_ORDER_SUCCESS,
    NEW_SAMPLE_ORDER_FAIL,
    MY_SAMPLE_ORDERS_REQUEST,
    MY_SAMPLE_ORDERS_SUCCESS,
    MY_SAMPLE_ORDERS_FAIL,
} from "../constants/orderConstants";
import api from "../utils/api";
// --- MODIFICATION: Import emptySampleCart action ---
import { emptyCart, emptySampleCart } from './cartAction';

// --- Regular Order Actions ---

// New Order
export const newOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch({ type: NEW_ORDER_REQUEST });

        const { user } = getState().user;
        const { cartItems, shippingInfo } = getState().cart;

        const orderItems = cartItems.map(item => ({
            name: item.name, price: item.price, quantity: item.quantity, image: item.image, product: item.product, unit: item.unit, cuttedPrice: item.cuttedPrice
        }));

        const order = {
            shippingInfo: {
                ...shippingInfo,
                businessType: user.businessType || 'individual',
                businessName: user.businessName || `${user.firstName} ${user.lastName}`.trim() || 'Customer',
                email: user.email
            },
            orderItems,
            paymentInfo: orderData.paymentInfo || { id: `mock_pay_${Date.now()}`, status: "succeeded" },
            discount: orderData.discount || 0,
            shippingPrice: orderData.shippingPrice || 0,
            totalPrice: orderData.totalPrice,
            itemsPrice: orderData.itemsPrice || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        const { data } = await api.post('/order/new', order);
        await dispatch(emptyCart());

        dispatch({
            type: NEW_ORDER_SUCCESS,
            payload: data,
        });

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


// --- MODIFICATION: Added Sample Order Actions ---

// New Sample Order
export const createSampleOrder = (orderData) => async (dispatch, getState) => {
    try {
        dispatch({ type: NEW_SAMPLE_ORDER_REQUEST });

        const { user } = getState().user;
        // Get items and shipping info from the sampleCart slice
        const { sampleCartItems, sampleShippingInfo } = getState().sampleCart;

        const orderItems = sampleCartItems.map(item => ({
            name: item.name, price: item.price, quantity: item.quantity, image: item.image, product: item.product, unit: item.unit, cuttedPrice: item.cuttedPrice
        }));

        const order = {
            shippingInfo: {
                ...sampleShippingInfo,
                businessType: user.businessType || 'individual',
                businessName: user.businessName || `${user.firstName} ${user.lastName}`.trim() || 'Customer',
                email: user.email
            },
            orderItems,
            paymentInfo: orderData.paymentInfo || { id: `mock_sample_pay_${Date.now()}`, status: "succeeded" },
            discount: orderData.discount || 0,
            shippingPrice: orderData.shippingPrice || 0,
            totalPrice: orderData.totalPrice,
            itemsPrice: orderData.itemsPrice || sampleCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        
        // Post to the new sample order endpoint
        const { data } = await api.post('/sample-order/new', order);

        // Clear the sample cart after a successful order
        await dispatch(emptySampleCart());

        dispatch({
            type: NEW_SAMPLE_ORDER_SUCCESS,
            payload: data,
        });

        return { success: true, data };

    } catch (error) {
        dispatch({
            type: NEW_SAMPLE_ORDER_FAIL,
            payload: error.response?.data?.message || 'Error creating sample order',
        });
        throw error;
    }
};

// Get User's Sample Orders
export const mySampleOrders = (page = 1) => async (dispatch) => {
    try {
        dispatch({ type: MY_SAMPLE_ORDERS_REQUEST });

        // Get from the new sample orders endpoint
        const { data } = await api.get(`/sample-orders/me?page=${page}`);
        
        const orders = data.orders || [];
        
        dispatch({
            type: MY_SAMPLE_ORDERS_SUCCESS,
            payload: {
                orders,
                currentPage: data.currentPage || page,
                totalPages: data.totalPages || 1,
                totalOrders: data.totalOrders || orders.length
            }
        });

    } catch (error) {
        dispatch({
            type: MY_SAMPLE_ORDERS_FAIL,
            payload: error.response?.data?.message || 'Error fetching sample orders'
        });
    }
};


// --- Other and Admin Actions (No changes needed below this line) ---

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
export const getAllOrdersWithoutPagination = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });
        
        const { data } = await axios.get('/api/v1/admin/orders/all');
        
        const orders = Array.isArray(data.orders) ? data.orders : [];
        const totalAmount = data.totalAmount || 0;
        const totalOrders = data.totalOrders || orders.length;
        
        const payload = {
            orders, totalAmount, totalOrders, totalPages: 1, currentPage: 1, limit: totalOrders, count: totalOrders
        };
        
        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload
        });
        
        return orders;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch all orders';
        
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: errorMessage,
        });
        
        throw new Error(errorMessage);
    }
};

// Get All Orders With Pagination ---ADMIN
export const getAllOrders = ({ page = 1, limit = 10, sortBy = '-createdAt' } = {}) => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });
        
        const queryParams = new URLSearchParams({ page, limit, sortBy }).toString();
        const url = `/admin/orders?${queryParams}`;
        
        const { data } = await api.get(url);

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: {
                orders: data.orders || [],
                totalOrders: data.pagination?.totalOrders || 0,
                totalPages: data.pagination?.totalPages || 1,
                currentPage: data.pagination?.currentPage || 1
            },
        });
        
        return data;

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
        
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: errorMessage,
        });
        
        throw new Error(errorMessage);
    }
};

// Update Order ---ADMIN
export const updateOrder = (id, order) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };
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
        
        const queryString = Object.entries(filters)
            .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        const response = await api.get(`/admin/orders/search?${queryString}`);

        dispatch({
            type: SEARCH_ORDERS_SUCCESS,
            payload: response.data
        });
        
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to search orders';
        
        dispatch({
            type: SEARCH_ORDERS_FAIL,
            payload: errorMessage
        });
        
        throw new Error(errorMessage);
    }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};