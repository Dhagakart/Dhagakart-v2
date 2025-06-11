import notFound from '../assets/images/404-not-found.png';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    
    return (
        <div className="my-10 flex flex-col gap-6 items-center justify-center px-4">
            <img draggable="false" className="w-[400px]" src={notFound} alt="Page Not Found" />
            <h1 className="text-2xl font-semibold text-center">Page Not Found</h1>
            <p className="text-gray-600 text-center max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-[#003366] text-white rounded-md font-medium transition-colors hover:cursor-pointer"
                >
                    Go Back
                </button>
                <Link 
                    to="/" 
                    className="px-6 py-2 text-[#003366] border border-[#003366] rounded-md font-medium transition-colors text-center"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
