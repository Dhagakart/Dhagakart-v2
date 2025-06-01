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
} from '../constants/userConstants';
import api from '../utils/api';

// Login User
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const { data } = await api.post('/login', { email, password });

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error.response?.data?.message || 'Login failed',
        });
    }
};

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const { data } = await api.post('/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response?.data?.message || 'Registration failed',
        });
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });
        const { data } = await api.get('/me');
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response?.data?.message || 'Failed to load user',
        });
    }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
    try {
        await api.get('/logout');
    } catch (error) {
        console.error('Logout error:', error.response?.data?.message || error.message);
    } finally {
        // Always clear the user state, even if the request fails
        dispatch({ type: LOGOUT_USER_SUCCESS });
    }
};

// Update User
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const { data } = await api.put(
            '/me/update',
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response?.data?.message || 'Failed to update profile',
        });
    }
};

// Update User Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const { data } = await api.put('/password/update', passwords);

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response?.data?.message || 'Failed to update password',
        });
    }
};


// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const { data } = await api.post('/password/forgot', { email });

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response?.data?.message || 'Failed to process forgot password request',
        });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const { data } = await api.put(
            `/password/reset/${token}`,
            passwords
        );

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response?.data?.message || 'Failed to reset password',
        });
    }
};

// Get All Users ---ADMIN
export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });
        const { data } = await api.get('/admin/users');
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        });
    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response?.data?.message || 'Failed to fetch users',
        });
    }
};

// Get User Details ---ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await api.get(`/admin/user/${id}`);
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response?.data?.message || 'Failed to fetch user details',
        });
    }
};

// Update User Details ---ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const { data } = await api.put(
            `/admin/user/${id}`,
            userData
        );

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response?.data?.message || 'Failed to update user',
        });
    }
};

// Delete User ---ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });
        const { data } = await api.delete(`/admin/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response?.data?.message || 'Failed to delete user',
        });
    }
};

// OAuth Login Success
export const oauthLoginSuccess = (user) => (dispatch) => {
    dispatch({ type: LOGIN_USER_SUCCESS, payload: user });};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};