import api from '../utils/api';
import {
    GET_MY_QUOTES_REQUEST,
    GET_MY_QUOTES_SUCCESS,
    GET_MY_QUOTES_FAIL,
    GET_QUOTE_DETAILS_REQUEST,
    GET_QUOTE_DETAILS_SUCCESS,
    GET_QUOTE_DETAILS_FAIL,
    CREATE_QUOTE_REQUEST,
    CREATE_QUOTE_SUCCESS,
    CREATE_QUOTE_FAIL,
    UPDATE_QUOTE_STATUS_REQUEST,
    UPDATE_QUOTE_STATUS_SUCCESS,
    UPDATE_QUOTE_STATUS_FAIL,
    CLEAR_QUOTE_ERRORS,
    GET_ALL_QUOTES_REQUEST,
    GET_ALL_QUOTES_SUCCESS,
    GET_ALL_QUOTES_FAIL
} from '../constants/quoteConstants';

// Get user's quotes
export const getMyQuotes = (page = 1, limit = 10) => async (dispatch) => {
    try {
        dispatch({ type: GET_MY_QUOTES_REQUEST });

        const config = {
            params: {
                page,
                limit
            }
        };

        const { data } = await api.get('/quote/me', config);

        dispatch({
            type: GET_MY_QUOTES_SUCCESS,
            payload: {
                quotes: data.quotes,
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage
            }
        });
    } catch (error) {
        dispatch({
            type: GET_MY_QUOTES_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get quote details
export const getQuoteDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_QUOTE_DETAILS_REQUEST });

        const { data } = await api.get(`/quote/${id}`);

        dispatch({
            type: GET_QUOTE_DETAILS_SUCCESS,
            payload: data.quote
        });
    } catch (error) {
        dispatch({
            type: GET_QUOTE_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Create new quote
export const createQuote = (quoteData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_QUOTE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.post('/quote/new', quoteData, config);

        dispatch({
            type: CREATE_QUOTE_SUCCESS,
            payload: data.quote
        });

        return data.success;
    } catch (error) {
        dispatch({
            type: CREATE_QUOTE_FAIL,
            payload: error.response?.data?.message || error.message
        });
        return false;
    }
};

// Update quote status (Admin)
export const updateQuoteStatus = (id, status) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_QUOTE_STATUS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await api.put(
            `/quote/admin/status/${id}`,
            { status },
            config
        );

        dispatch({
            type: UPDATE_QUOTE_STATUS_SUCCESS,
            payload: data.quote
        });

        return data.success;
    } catch (error) {
        dispatch({
            type: UPDATE_QUOTE_STATUS_FAIL,
            payload: error.response?.data?.message || error.message
        });
        return false;
    }
};

// Get all quotes (Admin)
export const getAllQuotes = (page = 1, limit = 10, status = '') => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_QUOTES_REQUEST });

        const config = {
            params: {
                page,
                limit,
                ...(status && { status })
            }
        };

        const { data } = await api.get('/quote/admin/all', config);

        dispatch({
            type: GET_ALL_QUOTES_SUCCESS,
            payload: {
                quotes: data.quotes,
                total: data.total,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage
            }
        });
    } catch (error) {
        dispatch({
            type: GET_ALL_QUOTES_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Clear errors
export const clearQuoteErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_QUOTE_ERRORS });
};
