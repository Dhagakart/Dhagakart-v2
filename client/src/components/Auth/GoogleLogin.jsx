import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../actions/userAction';

const GoogleLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Check for token in URL after OAuth redirect
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Store the token
            localStorage.setItem('token', token);
            
            // Fetch user data
            const fetchUser = async () => {
                try {
                    const response = await fetch('/api/v1/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    
                    if (data.success) {
                        dispatch(loginSuccess(data.user));
                        navigate('/account');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUser();
        }
    }, [dispatch, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:4000/api/v1/auth/google';
    };

    return (
        <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
            <img 
                className="w-5 h-5 mr-2" 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
            />
            Continue with Google
        </button>
    );
};

export default GoogleLogin;
