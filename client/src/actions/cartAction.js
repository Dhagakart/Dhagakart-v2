import axios from "axios";
import { 
    ADD_TO_CART, 
    EMPTY_CART, 
    REMOVE_FROM_CART, 
    SAVE_SHIPPING_INFO,
    // --- MODIFICATION: Import sample cart constants ---
    ADD_TO_SAMPLE_CART,
    REMOVE_FROM_SAMPLE_CART,
    EMPTY_SAMPLE_CART,
    SAVE_SAMPLE_SHIPPING_INFO,
} from "../constants/cartConstants";

// --- Regular Cart Actions ---

export const addItemsToCart = (id, quantity = 1, selectedUnit = null) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`https://dhagakart.onrender.com/api/v1/product/${id}`);
        // const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`);
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


// --- MODIFICATION: Added Sample Cart Actions ---

export const addItemsToSampleCart = (id, quantity = 1, selectedUnit = null) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`https://dhagakart.onrender.com/api/v1/product/${id}`);
        // const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`);
        const productData = data.product;
        // Read from the 'sampleCart' slice of the state
        const { sampleCartItems } = getState().sampleCart; 
        const itemInCart = sampleCartItems.find(i => i.product === id);
        
        let sourceUnit;

        if (selectedUnit) {
            sourceUnit = selectedUnit;
        } else if (itemInCart && itemInCart.unit) {
            sourceUnit = (productData.orderConfig?.units || []).find(u => u.unit === itemInCart.unit.name);
        } else {
            // For samples, you might have a specific sample unit or default to the standard one
            sourceUnit = (productData.orderConfig?.units || []).find(u => u.isDefault) || (productData.orderConfig?.units || [])[0];
        }

        if (!sourceUnit) {
            sourceUnit = {
                unit: 'sample', // Default unit name for samples
                price: productData.price, // Or a specific sample price
                cuttedPrice: productData.cuttedPrice,
                minQty: 1,
                maxQty: 5, // Samples might have a max quantity
                increment: 1,
            };
        }

        let validatedQuantity = Math.max(quantity, sourceUnit.minQty || 1);
        if (sourceUnit.maxQty) {
            validatedQuantity = Math.min(validatedQuantity, sourceUnit.maxQty);
        }

        dispatch({
            type: ADD_TO_SAMPLE_CART,
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

        // Save to a separate localStorage item
        localStorage.setItem('sampleCartItems', JSON.stringify(getState().sampleCart.sampleCartItems));

    } catch (error) {
        console.error("Error adding item to sample cart:", error);
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