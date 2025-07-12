import api from '../utils/api';
import {
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    CLEAR_ERRORS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    SLIDER_PRODUCTS_REQUEST,
    SLIDER_PRODUCTS_SUCCESS,
    SLIDER_PRODUCTS_FAIL,
} from "../constants/productConstants";

// Get All Products --- Filter/Search/Sort
export const getProducts =
    (keyword = "", category, price = [0, 200000], ratings = 0, currentPage = 1, subcategory = "") => async (dispatch) => {
        try {
            dispatch({ type: ALL_PRODUCTS_REQUEST });

            let url = `/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&page=${currentPage}`;
            if (category) {
                url += `&category=${category}`;
            }
            if (subcategory) {
                url += `&subCategory=${encodeURIComponent(subcategory)}`;
            }
            const { data } = await api.get(url);

            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: ALL_PRODUCTS_FAIL,
                payload: error.response.data.message,
            });
        }
    };

// Get All Products Of Same Category
export const getSimilarProducts = (category) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST });

        const { data } = await api.get(`/products?category=${category}`);

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await api.get(`/product/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// New/Update Review
export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });
        const config = { 
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        };
        
        const { data } = await api.put("/review", reviewData, config);

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success,
        });
        
        // Return the response data including the updated product
        return data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to submit review';
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: errorMessage,
        });
        throw new Error(errorMessage);
    }
}

// Get All Products ---PRODUCT SLIDER
export const getSliderProducts = () => async (dispatch) => {
    try {
        dispatch({ type: SLIDER_PRODUCTS_REQUEST });

        const { data } = await api.get('/products/all');

        dispatch({
            type: SLIDER_PRODUCTS_SUCCESS,
            payload: data.products,
        });
    } catch (error) {
        dispatch({
            type: SLIDER_PRODUCTS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Products ---ADMIN
export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST });

        const { data } = await api.get('/admin/products');

        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// New Product ---ADMIN
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });
        
        // For FormData, we don't need to set Content-Type header
        const { data } = await api.post("/admin/product/new", productData);

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        console.error('Product creation error:', error);
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response?.data?.message || 'Failed to create product',
        });
    }
}

// Remove Product Image
export const removeProductImage = (image) => ({
    type: 'REMOVE_PRODUCT_IMAGE',
    payload: image
});

// Update Product ---ADMIN
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        
        // Create FormData for file uploads
        const formData = new FormData();
        
        // Append all product data to formData
        Object.keys(productData).forEach(key => {
            if (key === 'images') {
                // Handle multiple image files
                for (let i = 0; i < productData.images.length; i++) {
                    formData.append('images', productData.images[i]);
                }
            } else if (key === 'removedImages' && productData.removedImages) {
                // Stringify removed images array
                formData.append('removedImages', JSON.stringify(productData.removedImages));
            } else if (key !== 'images') {
                formData.append(key, productData[key]);
            }
        });
        
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        
        const { data } = await api.put(`/admin/product/${id}`, formData, config);

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Delete Product ---ADMIN
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });
        const { data } = await api.delete(`/admin/product/${id}`);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: { success: data.success, productId: id },
        });
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Get Product Reviews ---ADMIN
export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEWS_REQUEST });
        const { data } = await api.get(`/admin/reviews?id=${id}`);

        dispatch({
            type: ALL_REVIEWS_SUCCESS,
            payload: data.reviews,
        });
    } catch (error) {
        dispatch({
            type: ALL_REVIEWS_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Delete Product Review ---ADMIN
export const deleteReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        const { data } = await api.delete(`/admin/reviews?id=${reviewId}&productId=${productId}`);

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Clear All Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}