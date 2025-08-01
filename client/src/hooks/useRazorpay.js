import { useState, useEffect } from 'react';

const useRazorpay = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check if the script is already in the document
        if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
            // If it is, check if window.Razorpay is available. Sometimes the script is there but not executed.
            if (window.Razorpay) {
                setIsLoaded(true);
            } else {
                // If not, wait for it to load
                const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
                const onLoad = () => setIsLoaded(true);
                script.addEventListener('load', onLoad);
                return () => script.removeEventListener('load', onLoad);
            }
            return;
        }

        // If the script is not in the document, create and append it
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
            setIsLoaded(true);
        };
        
        script.onerror = () => {
            console.error("Razorpay script failed to load.");
            setIsLoaded(false);
        };

        document.body.appendChild(script);

        // Cleanup function to remove the script if the component unmounts
        return () => {
            // You might not want to remove it if other components use it
            // document.body.removeChild(script);
        };
    }, []);

    return isLoaded;
};

export default useRazorpay;
