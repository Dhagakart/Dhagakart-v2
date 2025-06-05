import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { clearErrors } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import { Button, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OtpDG = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error } = useSelector((state) => state.user);
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = useRef([]);
    const [resendTimer, setResendTimer] = useState(30);
    const [phoneNumber, setPhoneNumber] = useState('+91 62029 48676'); // This would typically come from props or state

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }
    }, [dispatch, error, enqueueSnackbar]);

    useEffect(() => {
        // Timer for resend OTP
        const timer = resendTimer > 0 && setInterval(() => {
            setResendTimer(resendTimer - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 4) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = () => {
        const otpString = otp.join('');
        if (otpString.length === 5) {
            // Handle OTP verification logic here
            console.log('Verifying OTP:', otpString);
        }
    };

    const handleResendOtp = () => {
        if (resendTimer === 0) {
            setResendTimer(30);
            // Handle resend OTP logic here
            console.log('Resending OTP...');
        }
    };

    return (
        <>
            <MetaData title="Verify OTP | Dhagakart" />
            {loading && <BackdropLoader />}

            <main className="w-full mt-12 sm:pt-20 sm:mt-0">
                <div className="flex rounded-xl sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
                    {/* Left Side - Blue Background - Same as LoginDG */}
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

                    {/* Right Side - OTP Verification Form */}
                    <div className="bg-white rounded-tr-xl rounded-br-xl p-8 md:p-12 lg:p-16 md:w-1/2 flex flex-col justify-center">
                        <div className="max-w-md w-full mx-auto">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                            >
                                <ArrowBackIcon className="mr-1" />
                            </button>

                            <h1 className="text-2xl font-bold mb-6">OTP Verification</h1>

                            <p className="text-gray-600 mb-8 flex items-center gap-4">
                                {phoneNumber}
                                <button
                                    className="text-[#003366] hover:cursor-pointer underline"
                                    onClick={() => navigate('/loginDG')}
                                >
                                    Change
                                </button>
                            </p>

                            <p className="text-md font-bold text-gray-800 mb-2">Enter the OTP</p>

                            <div className="flex justify-between gap-3 mb-8">
                                {otp.map((digit, index) => (
                                    <TextField
                                        key={index}
                                        inputRef={el => inputRefs.current[index] = el}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        type="text"
                                        inputProps={{
                                            maxLength: 1,
                                            style: { textAlign: 'center', fontSize: '1.5rem' }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderRadius: '8px',
                                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#003366',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#003366',
                                                },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: '12px',
                                                width: '100%',
                                                textAlign: 'center',
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            {/* "Didn't receive the OTP?" text with better spacing */}
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-600">
                                    Didn't receive the OTP?{' '}
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0}
                                        className={`${resendTimer === 0
                                            ? 'text-[#003366] hover:underline font-medium'
                                            : 'text-gray-400'} transition-colors`}
                                    >
                                        Resend OTP{resendTimer > 0 && ` in ${resendTimer}s`}
                                    </button>
                                </p>
                            </div>

                            {/* Continue button with improved styling */}
                            <Button
                                fullWidth
                                variant="contained"
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
                                    px: '24px',
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    letterSpacing: '0.025em',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                                    '&.Mui-disabled': {
                                        backgroundColor: '#e0e0e0',
                                        color: '#9e9e9e',
                                    }
                                }}
                                onClick={handleVerifyOtp}
                                disabled={otp.some(digit => digit === '')}
                            >
                                Continue
                            </Button>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default OtpDG;