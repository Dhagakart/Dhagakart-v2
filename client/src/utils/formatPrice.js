// Function to format price in Indian numbering system
export const formatPrice = (price) => {
    return '₹' + new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }).format(price);
};
