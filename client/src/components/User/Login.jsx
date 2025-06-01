import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loginUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import GoogleIcon from '@mui/icons-material/Google';

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
        const returnUrl = encodeURIComponent(window.location.origin + '/account');
        window.location.href = `https://dhagakart.onrender.com/api/v1/auth/google?redirect=${returnUrl}`;
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
            <MetaData title="Login | Flipkart" />
            {loading && <BackdropLoader />}

            <main className="w-full mt-12 sm:pt-20 sm:mt-0">
                <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
                    <div className="loginSidebar bg-primary-blue p-10 pr-12 hidden sm:flex flex-col gap-4 w-2/5">
                        <h1 className="font-medium text-white text-3xl">Login</h1>
                        <p className="text-gray-200 text-lg">Get access to your Orders, Wishlist and Recommendations</p>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <div className="text-center py-10 px-4 sm:px-14">
                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col w-full gap-4">
                                    <TextField
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    <div className="flex flex-col gap-2.5 mt-2 mb-5">
                                        <p className="text-xs text-primary-grey text-left">
                                            By continuing, you agree to Flipkart's <a href="https://www.flipkart.com/pages/terms" className="text-primary-blue">Terms of Use</a> and <a href="https://www.flipkart.com/pages/privacypolicy" className="text-primary-blue">Privacy Policy</a>.
                                        </p>
                                        <button
                                            type="submit"
                                            className="text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium"
                                        >
                                            Login
                                        </button>
                                        <Link to="/password/forgot" className="hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>
                            </form>

                            <div className="my-4 flex items-center justify-center">
                                <div className="border-t border-gray-300 w-1/4" />
                                <span className="px-2 text-sm text-gray-500">OR</span>
                                <div className="border-t border-gray-300 w-1/4" />
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-2 border shadow px-4 py-2 rounded-sm w-full text-sm hover:bg-gray-50"
                            >
                                <GoogleIcon fontSize="small" />
                                Continue with Google
                            </button>

                            <Link to="/register" className="block mt-6 font-medium text-sm text-primary-blue">
                                New to Flipkart? Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;
