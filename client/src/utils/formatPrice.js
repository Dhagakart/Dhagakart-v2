// Function to format price in Indian numbering system
export const formatPrice = (price) => {
    // Handle undefined, null, or NaN values by defaulting to 0
    const amount = price !== undefined && price !== null && !isNaN(price) ? Number(price) : 0;
    return '₹' + new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }).format(amount);
};
