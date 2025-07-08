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
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_RESET,
    UPDATE_PROFILE_FAIL,
    CLEAR_ERRORS,
    FORGOT_PASSWORD_REQUEST,
    RESET_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_RESET,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_RESET,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_RESET,
    DELETE_USER_FAIL,
    REMOVE_USER_DETAILS,
    // Shipping Address
    ADD_SHIPPING_ADDRESS_REQUEST,
    ADD_SHIPPING_ADDRESS_SUCCESS,
    ADD_SHIPPING_ADDRESS_FAIL,
    UPDATE_SHIPPING_ADDRESS_REQUEST,
    UPDATE_SHIPPING_ADDRESS_SUCCESS,
    UPDATE_SHIPPING_ADDRESS_FAIL,
    UPDATE_SHIPPING_ADDRESS_RESET,
    DELETE_SHIPPING_ADDRESS_REQUEST,
    DELETE_SHIPPING_ADDRESS_SUCCESS,
    DELETE_SHIPPING_ADDRESS_FAIL,
    DELETE_SHIPPING_ADDRESS_RESET,
    // Billing Address
    ADD_BILLING_ADDRESS_REQUEST,
    ADD_BILLING_ADDRESS_SUCCESS,
    ADD_BILLING_ADDRESS_FAIL,
    UPDATE_BILLING_ADDRESS_REQUEST,
    UPDATE_BILLING_ADDRESS_SUCCESS,
    UPDATE_BILLING_ADDRESS_FAIL,
    UPDATE_BILLING_ADDRESS_RESET,
    DELETE_BILLING_ADDRESS_REQUEST,
    DELETE_BILLING_ADDRESS_SUCCESS,
    DELETE_BILLING_ADDRESS_FAIL,
    DELETE_BILLING_ADDRESS_RESET,
} from '../constants/userConstants';

export const userReducer = (state = { user: {}, success: false }, { type, payload }) => {
    switch (type) {
        case LOGIN_USER_REQUEST:
        case REGISTER_USER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            };
        case LOGIN_USER_SUCCESS:
        case REGISTER_USER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                success: type === REGISTER_USER_SUCCESS,
                user: payload,
            };
        case LOGOUT_USER_SUCCESS:
            return {
                loading: false,
                user: null,
                isAuthenticated: false,
            };
        case LOGIN_USER_FAIL:
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: payload,
            };
        case LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: payload,
            }
        case LOGOUT_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const profileReducer = (state = {}, { type, payload }) => {
    // Handle shipping and billing address operations
    if (type.includes('SHIPPING_ADDRESS') || type.includes('BILLING_ADDRESS')) {
        return {
            ...state,
            loading: type.endsWith('_REQUEST'),
            isUpdated: type.endsWith('_SUCCESS') && (type.includes('UPDATE_') || type.includes('ADD_')),
            isDeleted: type.endsWith('_SUCCESS') && type.includes('DELETE_'),
            error: type.endsWith('_FAIL') ? payload : null,
        };
    }
    
    // Handle other profile operations
    switch (type) {
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
        case ADD_SHIPPING_ADDRESS_REQUEST:
        case UPDATE_SHIPPING_ADDRESS_REQUEST:
        case DELETE_SHIPPING_ADDRESS_REQUEST:
        case ADD_BILLING_ADDRESS_REQUEST:
        case UPDATE_BILLING_ADDRESS_REQUEST:
        case DELETE_BILLING_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case ADD_SHIPPING_ADDRESS_SUCCESS:
        case UPDATE_SHIPPING_ADDRESS_SUCCESS:
        case ADD_BILLING_ADDRESS_SUCCESS:
        case UPDATE_BILLING_ADDRESS_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: payload,
            };
        case DELETE_SHIPPING_ADDRESS_SUCCESS:
        case DELETE_BILLING_ADDRESS_SUCCESS:
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: payload,
            };
        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
        case ADD_SHIPPING_ADDRESS_FAIL:
        case UPDATE_SHIPPING_ADDRESS_FAIL:
        case DELETE_SHIPPING_ADDRESS_FAIL:
        case ADD_BILLING_ADDRESS_FAIL:
        case UPDATE_BILLING_ADDRESS_FAIL:
        case DELETE_BILLING_ADDRESS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            }
        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
        case UPDATE_USER_RESET:
        case UPDATE_SHIPPING_ADDRESS_RESET:
        case UPDATE_BILLING_ADDRESS_RESET:
            return {
                ...state,
                isUpdated: false,
            }
        case DELETE_USER_RESET:
        case DELETE_SHIPPING_ADDRESS_RESET:
        case DELETE_BILLING_ADDRESS_RESET:
            return {
                ...state,
                isDeleted: false,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const forgotPasswordReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case FORGOT_PASSWORD_REQUEST:
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                message: payload,
            };
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: payload,
            };
        case FORGOT_PASSWORD_FAIL:
        case RESET_PASSWORD_FAIL:
            return {
                ...state,
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

export const allUsersReducer = (state = { users: [] }, { type, payload }) => {
    switch (type) {
        case ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: payload,
            };
        case ALL_USERS_FAIL:
            return {
                ...state,
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

export const userDetailsReducer = (state = { user: {} }, { type, payload }) => {
    switch (type) {
        case USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                user: payload,
            };
        case USER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            };
        case REMOVE_USER_DETAILS:
            return {
                ...state,
                user: {},
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