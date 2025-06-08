import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import { TextField, Button } from '@mui/material';
import GoogleIcon from '../../assets/images/googleLogo.png'

const LoginDG = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, isAuthenticated, error } = useSelector((state) => state.user);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = () => {
        // window.location.href = 'http://localhost:4000/api/v1/auth/google';
        window.location.href = 'https://dhagakart.onrender.com/api/v1/auth/google';
    };

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/account');
        }
    }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Login | Dhagakart" />
            {loading && <BackdropLoader />}

            <main className="w-full min-h-[90vh] mt-10 flex justify-center items-center">
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

                    {/* Right Side - Login Form */}
                    <div className="bg-white rounded-tr-xl rounded-br-xl p-8 md:p-12 lg:p-16 md:w-1/2 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8">Login or Sign Up</h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <TextField
                                        fullWidth
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter here"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: '8px', // Adjust the value as needed (8px is a standard rounded corner)
                                                },
                                            },
                                        }}
                                        required
                                    />
                                </div>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#003366',  // Change this to your desired color
                                        '&:hover': {
                                            backgroundColor: '#003366',  // Slightly darker shade for hover
                                        },
                                        color: 'white',
                                        py: '10px',
                                        px: '16px',
                                        borderRadius: '50px',  // Makes it pill-shaped
                                        textTransform: 'none',  // Prevents uppercase transformation
                                        fontWeight: 'medium',   // Makes text slightly bolder
                                    }}
                                    onClick={handleLogin}
                                >
                                    Continue
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">or</span>
                                    </div>
                                </div>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={
                                        <img 
                                            src={GoogleIcon} 
                                            alt="Google" 
                                            style={{ width: '18px', height: '18px', marginRight: '8px' }} 
                                        />
                                    }
                                    sx={{
                                        border: '1px solid gray',
                                        color: 'black',
                                        py: '10px',
                                        px: '16px',
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 'medium',
                                    }}
                                    onClick={handleGoogleLogin}
                                >
                                    Login With Google
                                </Button>

                                <p className="text-xs text-gray-500 text-center mt-6">
                                    By continuing, you agree to our{' '}
                                    <Link to="/terms" className="text-[#003366] hover:underline">Terms of Service</Link> and{' '}
                                    <Link to="/privacy" className="text-[#003366] hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
};

export default LoginDG;