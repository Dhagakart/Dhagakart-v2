import axios from "axios";
import { 
    ADD_TO_CART, 
    REMOVE_FROM_CART, 
    EMPTY_CART, 
    SAVE_SHIPPING_INFO,
    ADD_TO_SAMPLE_CART,
    REMOVE_FROM_SAMPLE_CART,
    EMPTY_SAMPLE_CART,
    SAVE_SAMPLE_SHIPPING_INFO,
} from "../constants/cartConstants";
import api from '../utils/api';

// --- Regular Cart Actions (No Changes) ---

export const addItemsToCart = (id, quantity = 1, selectedUnit = null) => async (dispatch, getState) => {
    try {
        const { sampleCartItems } = getState().sampleCart;
        
        // Check if there are items in the sample cart
        if (sampleCartItems && sampleCartItems.length > 0) {
            throw new Error('Please empty your sample cart before adding items to the regular cart.');
        }

        const { data } = await api.get(`/product/${id}`);
        const productData = data.product;
        const { cartItems } = getState().cart;
        const itemInCart = cartItems.find(i => i.product === id);
        
        let sourceUnit;

        if (selectedUnit) {
            sourceUnit = selectedUnit;
        } else if (itemInCart && itemInCart.unit) {
            sourceUnit = (productData.orderConfig?.units || []).find(u => u.unit === itemInCart.unit.name);
        } else {
            sourceUnit = (productData.orderConfig?.units || []).find(u => u.isDefault) || (productData.orderConfig?.units || [])[0];
        }

        if (!sourceUnit) {
            sourceUnit = {
                unit: 'unit',
                price: productData.price,
                cuttedPrice: productData.cuttedPrice,
                minQty: 1,
                increment: 1,
            };
        }

        let validatedQuantity = Math.max(quantity, sourceUnit.minQty || 1);
        if (sourceUnit.maxQty) {
            validatedQuantity = Math.min(validatedQuantity, sourceUnit.maxQty);
        }

        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: productData._id,
                name: productData.name,
                seller: productData.brand?.name || 'Seller',
                price: sourceUnit.price,
                cuttedPrice: sourceUnit.cuttedPrice,
                image: productData.images[0]?.url || '',
                stock: productData.stock,
                quantity: validatedQuantity,
                unit: {
                    name: sourceUnit.unit,
                    minQty: sourceUnit.minQty,
                    maxQty: sourceUnit.maxQty,
                    increment: sourceUnit.increment,
                    isDefault: sourceUnit.isDefault,
                    price: sourceUnit.price,
                    cuttedPrice: sourceUnit.cuttedPrice
                },
                availableUnits: productData.orderConfig?.units || []
            },
        });

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error; // Re-throw to be caught by the component
    }
};

export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: id,
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const emptyCart = () => async (dispatch, getState) => {
    dispatch({ type: EMPTY_CART });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });
    localStorage.setItem('shippingInfo', JSON.stringify(data));
};


// --- Sample Cart Actions (Updated) ---

export const addItemsToSampleCart = (id, quantity = 1) => async (dispatch, getState) => {
    try {
        const { cartItems } = getState().cart;
        
        // Check if there are items in the regular cart
        if (cartItems && cartItems.length > 0) {
            throw new Error('Please empty your cart before adding items to the sample cart.');
        }

        const { data } = await api.get(`/product/${id}`);
        const productData = data.product;

        // 1. Check if the product is available for sampling
        if (!productData.sampleConfig || !productData.sampleConfig.isSampleAvailable) {
            console.error("This product is not available as a sample.");
            // You can dispatch an error here to show a toast message
            return;
        }

        // 2. Validate the requested quantity against the max sample quantity
        const maxQty = productData.sampleConfig.maxQuantity || 1;
        const validatedQuantity = Math.min(quantity, maxQty);

        dispatch({
            type: ADD_TO_SAMPLE_CART,
            payload: {
                product: productData._id,
                name: productData.name,
                // 3. Use the specific sample price from the backend!
                price: productData.sampleConfig.price, 
                image: productData.images[0]?.url || '',
                stock: productData.stock,
                quantity: validatedQuantity,
                // 4. Pass the full sample config to the cart state
                sampleConfig: productData.sampleConfig, 
            },
        });

        localStorage.setItem('sampleCartItems', JSON.stringify(getState().sampleCart.sampleCartItems));

    } catch (error) {
        console.error("Error adding item to sample cart:", error);
        throw error; // Re-throw to be caught by the component
    }
};

export const removeItemsFromSampleCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_SAMPLE_CART,
        payload: id,
    });
    localStorage.setItem('sampleCartItems', JSON.stringify(getState().sampleCart.sampleCartItems));
};

export const emptySampleCart = () => async (dispatch, getState) => {
    dispatch({ type: EMPTY_SAMPLE_CART });
    localStorage.setItem('sampleCartItems', JSON.stringify(getState().sampleCart.sampleCartItems));
};

export const saveSampleShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SAMPLE_SHIPPING_INFO,
        payload: data
    });
    localStorage.setItem('sampleShippingInfo', JSON.stringify(data));
};
