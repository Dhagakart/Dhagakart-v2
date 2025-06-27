import { Link } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import successImage from '../../assets/images/Transaction/success.png';

const QuoteSuccess = () => {
    return (
        <>
            <MetaData title="Quote Request Submitted" />
            
            <main className="w-full min-h-[90vh] flex items-center justify-center mt-10 px-4 py-12">
                <div className="max-w-md w-full bg-white text-center">
                    {/* Success Icon */}
                    {/* <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6">
                        <img src={successImage} alt="Success" className="h-16 w-16" />
                    </div>
                     */}
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Your quote request has been submitted!</h1>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-8">
                        Thank you for your interest in our products. Our team will review your request and get back to you shortly with the best quote.
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
                            to="/account/rfqs" 
                            className="px-6 py-3 text-white rounded-md bg-[#003366] hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-1"
                        >
                            View Quote Requests <span>→</span>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default QuoteSuccess;
