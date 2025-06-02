// /oauth-success route
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                // This triggers backend middleware to validate cookie
                await axios.get('https://dhagakart.onrender.com/api/v1/me', {
                    withCredentials: true
                });

                // If successful, redirect to account
                navigate('/account');
            } catch (err) {
                // If token isn't set yet, retry after delay or show error
                navigate('/login?error=auth_failed');
            }
        };

        checkLogin();
    }, [navigate]);

    return <p>Logging you in with Google...</p>;
};

export default OAuthSuccess;
