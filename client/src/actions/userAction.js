import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    ALL_USERS_FAIL,
    ALL_USERS_SUCCESS,
    ALL_USERS_REQUEST,
    // Shipping Address
    ADD_SHIPPING_ADDRESS_REQUEST,
    ADD_SHIPPING_ADDRESS_SUCCESS,
    ADD_SHIPPING_ADDRESS_FAIL,
    UPDATE_SHIPPING_ADDRESS_REQUEST,
    UPDATE_SHIPPING_ADDRESS_SUCCESS,
    UPDATE_SHIPPING_ADDRESS_FAIL,
    DELETE_SHIPPING_ADDRESS_REQUEST,
    DELETE_SHIPPING_ADDRESS_SUCCESS,
    DELETE_SHIPPING_ADDRESS_FAIL,
    // Billing Address
    ADD_BILLING_ADDRESS_REQUEST,
    ADD_BILLING_ADDRESS_SUCCESS,    
    ADD_BILLING_ADDRESS_FAIL,
    UPDATE_BILLING_ADDRESS_REQUEST,
    UPDATE_BILLING_ADDRESS_SUCCESS,
    UPDATE_BILLING_ADDRESS_FAIL,
    DELETE_BILLING_ADDRESS_REQUEST,
    DELETE_BILLING_ADDRESS_SUCCESS,
    DELETE_BILLING_ADDRESS_FAIL,
} from '../constants/userConstants';
import api from '../utils/api';

const getErrorMessage = (error) => {
    return error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
};

// Login User
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const { data } = await api.post('/users/login', { email, password });

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data.user
        });

    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error.response?.data?.message || 'Login failed'
        });
    }
}

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const { data } = await api.post('/users/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });

        return { user: data.user }; // Return the user data

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response?.data?.message || 'Registration failed',
        });
        throw error; // Re-throw the error to handle it in the component
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await api.get('/users/me');

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Logout User
export const logoutUser = (callback) => async (dispatch) => {
    try {
        await api.get('/users/logout');
        dispatch({ type: LOGOUT_USER_SUCCESS });
        if (callback && typeof callback === 'function') {
            callback();
        }
    } catch (error) {
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update User
export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await api.put('/users/me/update', userData, config);

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data.user });

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update User Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await api.put('/users/password/update', passwords, config);

        dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.user });

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};


// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await api.post('/users/password/forgot', email, config);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {

        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await api.put(`/users/password/reset/${token}`, passwords, config);

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Users ---ADMIN
export const getAllUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USERS_REQUEST });
        const { data } = await api.get('/users/admin/users');
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        });

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get User Details ---ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await api.get(`/users/admin/user/${id}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update User Details ---ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await api.put(`/users/admin/user/${id}`, userData, config);

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete User ---ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_USER_REQUEST });
        const { data } = await api.delete(`/users/admin/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Add Shipping Address
export const addShippingAddress = (addressData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_SHIPPING_ADDRESS_REQUEST });
        // CORRECTED URL: Removed '/users' prefix
        const { data } = await api.post('/users/me/address/shipping', addressData);
        dispatch({ type: ADD_SHIPPING_ADDRESS_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: ADD_SHIPPING_ADDRESS_FAIL, payload: getErrorMessage(error) });
        throw error;
    }
};

// Update Shipping Address
export const updateShippingAddress = (addressId, addressData) => async (dispatch) => {
    try {
        // CORRECTED ACTION TYPE: Using imported constant
        dispatch({ type: UPDATE_SHIPPING_ADDRESS_REQUEST });
        // CORRECTED URL: Removed '/users' prefix
        const { data } = await api.put(`/users/me/address/shipping/${addressId}`, addressData);
        // CORRECTED ACTION TYPE: Using imported constant
        dispatch({ type: UPDATE_SHIPPING_ADDRESS_SUCCESS, payload: data.user });
    } catch (error) {
        // CORRECTED ACTION TYPE: Using imported constant
        dispatch({ type: UPDATE_SHIPPING_ADDRESS_FAIL, payload: getErrorMessage(error) });
        throw error;
    }
};

// Delete Shipping Address
export const deleteShippingAddress = (addressId) => async (dispatch) => {
    try {
        // CORRECTED ACTION TYPE: Using imported constant
        dispatch({ type: DELETE_SHIPPING_ADDRESS_REQUEST });
        // CORRECTED URL: Removed '/users' prefix
        const { data } = await api.delete(`/users/me/address/shipping/${addressId}`);
        // CORRECTED ACTION TYPE: Using imported constant
        dispatch({ type: DELETE_SHIPPING_ADDRESS_SUCCESS, payload: data.user });
    } catch (error) {
        // CORRECTED ACTION TYPE: Using imported constant
        dispatch({ type: DELETE_SHIPPING_ADDRESS_FAIL, payload: getErrorMessage(error) });
        throw error;
    }
};

// Add Billing Address
export const addBillingAddress = (addressData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_BILLING_ADDRESS_REQUEST });

        const { data } = await api.post('/users/me/address/billing', addressData);

        dispatch({
            type: ADD_BILLING_ADDRESS_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        // --- THIS IS THE FIX ---
        // This safely extracts the error message, whether it's from the server or a local JS error.
        const message = 
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: ADD_BILLING_ADDRESS_FAIL,
            payload: message,
        });

        // Log the full error to see the original cause
        console.error("Full error in addBillingAddress:", error);
        
        // Re-throw a clean error for the component to catch
        throw new Error(message);
    }
};

// Update Billing Address
export const updateBillingAddress = (addressId, addressData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_BILLING_ADDRESS_REQUEST });
        const { data } = await api.put(`/users/me/address/billing/${addressId}`, addressData);
        dispatch({
            type: UPDATE_BILLING_ADDRESS_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_BILLING_ADDRESS_FAIL,
            payload: error.response.data.message,
        });
        throw error;
    }
};

// Delete Billing Address
export const deleteBillingAddress = (addressId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_BILLING_ADDRESS_REQUEST });
        const { data } = await api.delete(`/users/me/address/billing/${addressId}`);
        dispatch({
            type: DELETE_BILLING_ADDRESS_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: DELETE_BILLING_ADDRESS_FAIL,
            payload: error.response.data.message,
        });
        throw error;
    }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};