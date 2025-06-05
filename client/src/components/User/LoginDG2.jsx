import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import { TextField, Button, Checkbox } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LoginDG2 = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            enqueueSnackbar("Passwords don't match", { variant: 'error' });
            return;
        }
        if (!formData.agreeTerms) {
            enqueueSnackbar("Please agree to the Terms & Conditions", { variant: 'error' });
            return;
        }
        // Handle registration logic here
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <MetaData title="Register | Dhagakart" />
            {loading && <BackdropLoader />}

            <main className="w-full min-h-screen mt-10 flex justify-center items-center">
                <div className="flex rounded-xl sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
                    {/* Left Side - Blue Background */}
                    <div className="bg-[#003366] rounded-tl-xl rounded-bl-xl text-white p-4 md:p-8 lg:p-16 md:w-1/2 flex flex-col justify-start">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">Your one-stop platform for A to Z textile.</h1>
                        <ul className="space-y-4 text-lg">
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 mt-1" />
                                <span>Get everything related to textile</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 mt-1" />
                                <span>See all the latest machines and buy it</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 mt-1" />
                                <span>Buy pricing material available to buy</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircleIcon className="mr-2 mt-1" />
                                <span>Fast delivery to your doorstep</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="bg-white rounded-tr-xl rounded-br-xl p-4 md:p-8 lg:p-16 md:w-1/2 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                            >
                                <ArrowBackIcon className="mr-1" />
                            </button>

                            <h1 className="text-2xl font-bold text-gray-800 mb-8">Great!, Almost Done.</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        User Name
                                    </label>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: '8px',
                                                },
                                            },
                                        }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email ID
                                    </label>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: '8px',
                                                },
                                            },
                                        }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: '8px',
                                                },
                                            },
                                        }}
                                    />
                                </div>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        backgroundColor: '#003366',
                                        '&:hover': {
                                            backgroundColor: '#002b57',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(0)',
                                        },
                                        color: 'white',
                                        py: '12px',
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        fontWeight: '500',
                                        fontSize: '1rem',
                                        letterSpacing: '0.025em',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    Continue
                                </Button>
                                <p className="text-center text-sm text-gray-600 mt-6">
                                    By Continuing, you agree to our Terms of Service & Privacy Policy
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default LoginDG2;