import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import successImage from '../../assets/images/Transaction/success.png';

const OrderSuccess = () => {
    // const navigate = useNavigate();
    // const [time, setTime] = useState(5);

    // useEffect(() => {
    //     if (time === 0) {
    //         navigate("/");
    //         return;
    //     };
    //     const intervalId = setInterval(() => {
    //         setTime(time - 1);
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [time, navigate]);

    return (
        <>
            <MetaData title="Order Successfully Placed" />
            
            <main className="w-full min-h-[90vh] flex items-center justify-center mt-10 px-4 py-12">
                <div className="max-w-md w-full bg-white text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6">
                        <img src={successImage} alt="Success" />
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Your order is successfully placed</h1>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-8">
                        Pellentesque sed lectus nec tortor tristique accumsan quis dictum risus. Donec volutpat mollis nulla non facilisis.
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/" 
                            className="px-6 py-3 text-[#003366] rounded-md text-sm font-medium border border-[#003366]"
                        >
                            Go to Home
                        </Link>
                        <Link 
                            to="/account" 
                            className="px-6 py-3 text-white rounded-md bg-[#003366] hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                            View Order <span>→</span>
                        </Link>
                    </div>
                    
                    {/* Countdown (optional)
                    <p className="text-gray-500 text-sm mt-6">
                        Redirecting to home in {time} seconds...
                    </p> */}
                </div>
            </main>
        </>
    );
};

export default OrderSuccess;