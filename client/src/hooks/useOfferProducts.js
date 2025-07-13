import { useState, useEffect } from 'react';
import axios from 'axios';

export const useOfferProducts = () => {
  const [offerProducts, setOfferProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://dhagakart.onrender.com/api/v1/products?keyword=&price[gte]=0&price[lte]=20000000&ratings[gte]=0&page=1'
        );

        // Sort products by discount percentage (calculated as (originalPrice - currentPrice) / originalPrice * 100)
        const sortedProducts = response.data.products.sort((a, b) => {
          const discountA = ((a.price - a.discountedPrice) / a.price) * 100;
          const discountB = ((b.price - b.discountedPrice) / b.price) * 100;
          return discountB - discountA; // Descending order
        });

        // Take top 6 products with highest discounts
        const topProducts = sortedProducts.slice(0, 6).map(product => ({
          ...product, // Spread all existing product properties
          discount: Math.round(((product.price - product.cuttedPrice) / product.price) * 100),
          tag: 'Best Deal',
        }));

        setOfferProducts(topProducts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { offerProducts, loading, error };
};
