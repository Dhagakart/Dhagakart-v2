import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import GoogleIcon from '../../assets/images/googleLogo.png'
import { TextField, Button } from '@mui/material';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    };

    const handleGoogleLogin = () => {
        window.location.href = 'https://dhagakart.onrender.com/api/v1/auth/google';
        // window.location.href = 'http://localhost:4000/api/v1/auth/google';
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate(`/account`);
        }
    }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Login | DhagaKart" />
            {loading && <BackdropLoader />}

            <main className="w-full min-h-[80vh] mt-10 flex justify-center items-center">
                <div className="flex rounded-xl sm:w-4/6 sm:mt-6 m-auto mb-7 bg-white shadow-lg">
                    {/* Left Side - Blue Background */}
                    <div className="bg-[#003366] rounded-tl-xl rounded-bl-xl text-white p-6 md:p-8 lg:p-10 md:w-1/2 flex flex-col justify-start">
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">Your one-stop platform for A to Z textile.</h1>
                        <ul className="space-y-3 text-base">
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
                    <div className="bg-white rounded-tr-xl rounded-br-xl p-6 md:p-8 lg:p-12 md:w-1/2 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Login</h2>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
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

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                                <div className="flex flex-col gap-2 mt-2 mb-4">
                                    <p className="text-xs text-gray-500 text-left">
                                        By continuing, you agree to our <a href="#" className="text-[#003366]">Terms of Use</a> and <a href="#" className="text-[#003366]">Privacy Policy</a>.
                                    </p>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#003366',
                                            '&:hover': {
                                                backgroundColor: '#002a52',
                                            },
                                            textTransform: 'none',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                        }}
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </Button>
                                    <Link to="/password/forgot" className="text-[#003366] text-center py-2 w-full text-sm font-medium hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <div className="my-3 flex items-center justify-center">
                                <div className="border-t border-gray-300 w-1/4" />
                                <span className="px-2 text-sm text-gray-500">OR</span>
                                <div className="border-t border-gray-300 w-1/4" />
                            </div>

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderColor: '#003366',
                                    color: '#003366',
                                    textTransform: 'none',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    }
                                }}
                                onClick={handleGoogleLogin}
                                startIcon={<img src={GoogleIcon} alt="Google" className="w-5 h-5" />}
                            >
                                Continue with Google
                            </Button>
                            <Link to="/register" className="block mt-4 font-medium text-sm text-primary-blue">
                                New to DhagaKart? Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;
