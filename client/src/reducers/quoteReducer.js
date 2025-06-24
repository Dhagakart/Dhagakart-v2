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
    CLEAR_QUOTE_ERRORS
} from '../constants/quoteConstants';

export const quoteListReducer = (state = { quotes: [] }, { type, payload }) => {
    switch (type) {
        case GET_MY_QUOTES_REQUEST:
            return {
                ...state,
                loading: true,
                quotes: []
            };
        case GET_MY_QUOTES_SUCCESS:
            return {
                loading: false,
                quotes: payload.quotes,
                quotesCount: payload.count,
                resPerPage: payload.resPerPage,
                filteredQuotesCount: payload.filteredQuotesCount
            };
        case GET_MY_QUOTES_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case CLEAR_QUOTE_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const quoteDetailsReducer = (state = { quote: {} }, { type, payload }) => {
    switch (type) {
        case GET_QUOTE_DETAILS_REQUEST:
        case UPDATE_QUOTE_STATUS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_QUOTE_DETAILS_SUCCESS:
        case UPDATE_QUOTE_STATUS_SUCCESS:
            return {
                loading: false,
                quote: payload
            };
        case GET_QUOTE_DETAILS_FAIL:
        case UPDATE_QUOTE_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case CLEAR_QUOTE_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const newQuoteReducer = (state = { quote: {} }, { type, payload }) => {
    switch (type) {
        case CREATE_QUOTE_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CREATE_QUOTE_SUCCESS:
            return {
                loading: false,
                success: payload.success,
                quote: payload.quote
            };
        case CREATE_QUOTE_FAIL:
            return {
                ...state,
                loading: false,
                error: payload
            };
        case CLEAR_QUOTE_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};
