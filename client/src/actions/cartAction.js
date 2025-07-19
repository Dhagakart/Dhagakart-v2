import axios from "axios";
import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

export const addItemsToCart = (id, quantity = 1, selectedUnit = null) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`https://dhagakart.onrender.com/api/v1/product/${id}`);
        const productData = data.product;
        const { cartItems } = getState().cart;
        const itemInCart = cartItems.find(i => i.product === id);
        
        let sourceUnit; // This will hold the raw unit object from the API.

        // Determine which unit to use.
        if (selectedUnit) {
            // A new unit was explicitly selected by the user.
            sourceUnit = selectedUnit;
        } else if (itemInCart && itemInCart.unit) {
            // The item is already in the cart, find its unit data from the fresh API call to prevent stale data.
            sourceUnit = (productData.orderConfig?.units || []).find(u => u.unit === itemInCart.unit.name);
        } else {
            // It's a new item, so find the default unit.
            sourceUnit = (productData.orderConfig?.units || []).find(u => u.isDefault) || (productData.orderConfig?.units || [])[0];
        }

        // Fallback if no units are defined at all.
        if (!sourceUnit) {
            sourceUnit = {
                unit: 'unit',
                price: productData.price,
                cuttedPrice: productData.cuttedPrice,
                minQty: 1,
                increment: 1,
            };
        }

        // Validate quantity.
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
                // Always build a standardized unit object with a `.name` property.
                unit: {
                    name: sourceUnit.unit,
                    minQty: sourceUnit.minQty,
                    maxQty: sourceUnit.maxQty,
                    increment: sourceUnit.increment,
                    isDefault: sourceUnit.isDefault,
                    price: sourceUnit.price, // It can be useful to have price here too
                    cuttedPrice: sourceUnit.cuttedPrice
                },
                availableUnits: productData.orderConfig?.units || []
            },
        });

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

    } catch (error) {
        // Handle potential errors, e.g., product not found.
        console.error("Error adding item to cart:", error);
    }
};

// --- No changes needed for the functions below ---

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