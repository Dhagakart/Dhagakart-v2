import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, forgotPassword } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import { TextField, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPasswordDG = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // State for form and UI
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            // Uncomment for actual API integration
            // const formData = new FormData();
            // formData.set('email', email);
            // dispatch(forgotPassword(formData));
        }, 1000);
    };

    // Error handling for API integration (commented out for mock)
    // useEffect(() => {
    //     if (error) {
    //         enqueueSnackbar(error, { variant: 'error' });
    //         dispatch(clearErrors());
    //     }
    //     if (message) {
    //         enqueueSnackbar(message, { variant: 'success' });
    //     }
    // }, [dispatch, error, message, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Forgot Password | Dhagakart" />
            {isLoading && <BackdropLoader />}

            <main className="w-full mt-12 sm:pt-20 sm:mt-0">
                <div className="flex rounded-xl sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
                    {/* Left Side - Blue Background */}
                    <div className="bg-[#003366] rounded-tl-xl rounded-bl-xl text-white p-8 md:p-12 lg:p-16 md:w-1/2 flex flex-col justify-start">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">Your one-stop platform for A to Z textile.</h1>
                        <ul className="space-y-4 text-lg">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Get everything related to textile</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>See all the latest machines and buy it</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Buy pricing material available to buy</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Fast delivery to your doorstep</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Side - Forgot Password Form */}
                    <div className="bg-white rounded-tr-xl rounded-br-xl p-8 md:p-12 lg:p-16 md:w-1/2 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <button 
                                onClick={() => navigate(-1)}
                                className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                            >
                                <ArrowBackIcon className="mr-1" />
                                <span>Back</span>
                            </button>
                            
                            {!isSubmitted ? (
                                <>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
                                    <p className="text-gray-600 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email Address
                                            </label>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                type="email"
                                                placeholder="Enter your registered email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderRadius: '8px',
                                                        },
                                                    },
                                                }}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            disabled={isLoading}
                                            sx={{
                                                backgroundColor: '#003366',
                                                '&:hover': {
                                                    backgroundColor: '#002244',
                                                },
                                                '&.Mui-disabled': {
                                                    backgroundColor: '#e0e0e0',
                                                    color: '#9e9e9e'
                                                },
                                                color: 'white',
                                                py: '10px',
                                                px: '16px',
                                                borderRadius: '20px',
                                                textTransform: 'none',
                                                fontWeight: 'medium',
                                            }}
                                        >
                                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-600">
                                            Remember your password?{' '}
                                            <Link to="/loginDG" className="text-[#003366] hover:underline font-medium">
                                                Login here
                                            </Link>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email Address
                                            </label>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                type="email"
                                                placeholder="Enter your registered email"
                                                value={email}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderRadius: '8px',
                                                        },
                                                    },
                                                }}
                                                disabled
                                            />
                                        </div>

                                        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center mb-4">
                                            <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-green-800 text-sm">Reset password email sent to your email</span>
                                        </div>

                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            onClick={() => navigate('/loginDG')}
                                            sx={{
                                                backgroundColor: '#003366',
                                                '&:hover': {
                                                    backgroundColor: '#002244',
                                                },
                                                color: 'white',
                                                py: '10px',
                                                px: '16px',
                                                borderRadius: '20px',
                                                textTransform: 'none',
                                                fontWeight: 'medium',
                                                mt: 2
                                            }}
                                        >
                                            Back to Login
                                        </Button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-600">
                                            Didn't receive the email?{' '}
                                            <button type="button" className="text-[#003366] hover:underline font-medium">
                                                Click to resend
                                            </button>
                                        </p>
                                    </div>
                                    
                                    <p className="text-xs text-gray-500 mt-6 text-center">
                                        <Link to="/contact" className="text-[#003366] hover:underline">Need help? Contact Support</Link>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default ForgotPasswordDG;