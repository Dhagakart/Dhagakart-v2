import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { loginUser, clearErrors } from '../../actions/userAction';
import GoogleIcon from '../../assets/images/googleLogo.png';
import BackdropLoader from '../Layouts/BackdropLoader';

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const { loading, isAuthenticated, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle login
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = 'https://dhagakart.onrender.com/api/v1/auth/google';
  };

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle authentication state changes
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      onClose();
    }
  }, [dispatch, isAuthenticated, error, onClose, enqueueSnackbar]);

  // Handle click outside modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  if (loading) return <BackdropLoader />;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="relative flex flex-col lg:flex-row rounded-xl w-full max-w-4xl bg-white shadow-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer transition-colors duration-200 z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Left Side - Promotional Content (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#00264d] to-[#003366] p-8 flex-col justify-center text-white">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Welcome Back</h1>
          <p className="text-base opacity-90 mb-6">Sign in to continue your premium shopping experience</p>
          <div className="space-y-3">
            {[
              "Best Market Pricing", "Reliable On-Time Delivery", "Flexible Credit & Financing Options", "Bulk Order Benefits",
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm md:text-base">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 w-full lg:w-3/5 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center lg:text-left">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-colors duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="/password/forgot" className="text-xs sm:text-sm text-[#003366] hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-colors duration-200"
                  required
                />
              </div>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-[#003366] hover:underline">Terms of Use</a> and{' '}
                <a href="/privacy" className="text-[#003366] hover:underline">Privacy Policy</a>.
              </p>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg text-white font-semibold bg-[#003366] hover:bg-[#00264d] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-lg text-[#003366] font-semibold border border-[#003366] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]/20 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <img src={GoogleIcon} alt="Google" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Continue with Google</span>
              </button>
              <p className="text-center mt-4 text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="text-[#003366] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003366]/20 rounded px-1 -ml-1">
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;