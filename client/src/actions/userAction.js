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

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        });

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

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        });

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

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await api.post('/users/me/address/shipping', addressData, config);

        dispatch({
            type: ADD_SHIPPING_ADDRESS_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        dispatch({
            type: ADD_SHIPPING_ADDRESS_FAIL,
            payload: error.response?.data?.message || 'Failed to add shipping address',
        });
        throw error;
    }
};

// Update Shipping Address
export const updateShippingAddress = (addressId, addressData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_SHIPPING_ADDRESS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await api.put(`/users/me/address/shipping/${addressId}`, addressData, config);

        dispatch({
            type: UPDATE_SHIPPING_ADDRESS_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        dispatch({
            type: UPDATE_SHIPPING_ADDRESS_FAIL,
            payload: error.response?.data?.message || 'Failed to update shipping address',
        });
        throw error;
    }
};

// Delete Shipping Address
export const deleteShippingAddress = (addressId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_SHIPPING_ADDRESS_REQUEST });
        console.log('Deleting shipping address with ID:', addressId);
        
        // Remove the /api/v1 prefix since it's already in the baseURL
        const { data } = await api.delete(`/users/me/address/shipping/${addressId}`);
        console.log('Delete shipping address response:', data);

        if (data && data.success) {
            dispatch({
                type: DELETE_SHIPPING_ADDRESS_SUCCESS,
                payload: data.user,
            });
            return { success: true, user: data.user };
        } else {
            throw new Error(data?.message || 'Failed to delete shipping address');
        }
    } catch (error) {
        console.error('Error in deleteShippingAddress:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete shipping address';
        
        dispatch({
            type: DELETE_SHIPPING_ADDRESS_FAIL,
            payload: errorMessage,
        });
        throw new Error(errorMessage);
    }
};

// Add Billing Address
export const addBillingAddress = (addressData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_BILLING_ADDRESS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await api.post('/users/me/address/billing', addressData, config);

        dispatch({
            type: ADD_BILLING_ADDRESS_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        dispatch({
            type: ADD_BILLING_ADDRESS_FAIL,
            payload: error.response?.data?.message || 'Failed to add billing address',
        });
        throw error;
    }
};

// Update Billing Address
export const updateBillingAddress = (addressId, addressData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_BILLING_ADDRESS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await api.put(`/users/me/address/billing/${addressId}`, addressData, config);

        dispatch({
            type: UPDATE_BILLING_ADDRESS_SUCCESS,
            payload: data.user,
        });

        return data.user;
    } catch (error) {
        dispatch({
            type: UPDATE_BILLING_ADDRESS_FAIL,
            payload: error.response?.data?.message || 'Failed to update billing address',
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

        return data.user;
    } catch (error) {
        dispatch({
            type: DELETE_BILLING_ADDRESS_FAIL,
            payload: error.response?.data?.message || 'Failed to delete billing address',
        });
        throw error;
    }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};