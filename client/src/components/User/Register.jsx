import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import FormSidebar from './FormSidebar';
import GoogleIcon from '@mui/icons-material/Google';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        name: '',
        email: '',
        gender: '',
        password: '',
        cpassword: '',
    });

    const { name, email, gender, password, cpassword } = user;

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState('preview.png');

    const handleRegister = (e) => {
        e.preventDefault();

        if (password.length < 8) {
            enqueueSnackbar('Password must be at least 8 characters.', { variant: 'warning' });
            return;
        }

        if (password !== cpassword) {
            enqueueSnackbar("Passwords don't match.", { variant: 'error' });
            return;
        }

        if (!avatar) {
            enqueueSnackbar('Please select an avatar.', { variant: 'error' });
            return;
        }

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('gender', gender);
        formData.set('password', password);
        formData.set('avatar', avatar);

        dispatch(registerUser(formData));
    };

    const handleDataChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:4000/api/v1/auth/google';
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/');
        }
    }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Register | Flipkart" />

            {loading && <BackdropLoader />}

            <main className="w-full mt-12 sm:pt-20 sm:mt-0">
                <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
                    <FormSidebar
                        title="Looks like you're new here!"
                        tag="Sign up with your mobile number to get started"
                    />

                    <div className="flex-1 overflow-hidden">
                        <form
                            onSubmit={handleRegister}
                            encType="multipart/form-data"
                            className="p-5 sm:p-10"
                        >
                            <div className="flex flex-col gap-4 items-start">

                                <div className="flex flex-col w-full gap-3">
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={name}
                                        onChange={handleDataChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 items-center">
                                    <h2 className="text-md">Your Gender:</h2>
                                    <RadioGroup row>
                                        <FormControlLabel
                                            name="gender"
                                            value="male"
                                            control={<Radio required />}
                                            label="Male"
                                            onChange={handleDataChange}
                                        />
                                        <FormControlLabel
                                            name="gender"
                                            value="female"
                                            control={<Radio required />}
                                            label="Female"
                                            onChange={handleDataChange}
                                        />
                                    </RadioGroup>
                                </div>

                                <div className="flex flex-col sm:flex-row w-full gap-3">
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handleDataChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Confirm Password"
                                        type="password"
                                        name="cpassword"
                                        value={cpassword}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row w-full gap-3 items-center">
                                    <Avatar
                                        alt="Avatar Preview"
                                        src={avatarPreview}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    <label className="rounded font-medium bg-gray-400 text-center cursor-pointer text-white w-full py-2 px-2.5 shadow hover:shadow-lg">
                                        <input
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={handleDataChange}
                                            className="hidden"
                                        />
                                        Choose File
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="text-white py-3 w-full bg-primary-orange shadow hover:shadow-lg rounded-sm font-medium"
                                >
                                    Signup
                                </button>

                                <Link
                                    to="/login"
                                    className="hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium"
                                >
                                    Existing User? Log in
                                </Link>

                                <div className="my-4 flex items-center justify-center w-full">
                                    <div className="border-t border-gray-300 w-1/4" />
                                    <span className="px-2 text-sm text-gray-500">OR</span>
                                    <div className="border-t border-gray-300 w-1/4" />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="flex items-center justify-center gap-2 border shadow px-4 py-2 rounded-sm w-full text-sm hover:bg-gray-50"
                                >
                                    <GoogleIcon fontSize="small" />
                                    Continue with Google
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Register;
