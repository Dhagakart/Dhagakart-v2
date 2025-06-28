import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import GoogleIcon from '../../assets/images/googleLogo.png'
import { TextField, Button } from '@mui/material';
import { Grid, Box, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    }

    // const redirect = location.search ? location.search.split("=")[1] : "account";

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/');
        }
    }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

    const handleGoogleLogin = () => {
        window.location.href = 'https://dhagakart.onrender.com/api/v1/auth/google';
        // window.location.href = 'http://localhost:4000/api/v1/auth/google';
    };

    return (
        <>
            <MetaData title="Login | DhagaKart" />
            {loading && <BackdropLoader />}

            <main className="w-full min-h-[80vh] mt-10 flex justify-center items-center">
                <div className="flex rounded-xl sm:w-4/6 sm:mt-6 m-auto mb-7 bg-white shadow-lg">
                    {/* Left Side - Blue Background */}
                    <Grid item xs={12} md={5} sx={{ background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '8px 0 0 8px' }}>
                        <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                            A–Z Textile Hub
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                            Join DhagaKart today and discover a world of premium textile products.
                        </Typography>
                        <Box>
                            {['Secure Business Account', 'Premium Textile Selection', 'Dedicated Account Manager', '24/7 Business Support'].map((t, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CheckCircleOutlineIcon sx={{ color: 'warning.main' }} />
                                    <Typography sx={{ color: 'white' }}>{t}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                document.getElementById('password').focus();
                                            }
                                        }}
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
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleLogin(e);
                                            }
                                        }}
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
                            <Link to="/register" className="block mt-4">
                                New to DhagaKart? <span className="text-primary-blue font-medium hover:underline">Create an account</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;
