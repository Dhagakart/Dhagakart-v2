import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { clearErrors, getUserDetails, updateUser } from '../../actions/userAction';
import { UPDATE_USER_RESET, REMOVE_USER_DETAILS } from '../../constants/userConstants';
import Loading from './Loading';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import { FiUser, FiMail, FiShield, FiPlus } from 'react-icons/fi';
import { IoMdMale, IoMdFemale } from 'react-icons/io';

const UpdateUser = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const navigate = useNavigate();

    const { user, error, loading } = useSelector((state) => state.userDetails);
    const { isUpdated, error: updateError, loading: updateLoading } = useSelector((state) => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const userId = params.id;

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("gender", gender);
        formData.set("role", role);

        dispatch(updateUser(userId, formData));
    }

    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setGender(user.gender);
            setRole(user.role);
            // setAvatarPreview(user.avatar.url);
        }
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("User Updates Successfully", { variant: "success" });
            dispatch({ type: UPDATE_USER_RESET });
            dispatch({ type: REMOVE_USER_DETAILS });
            navigate("/admin/users");
        }
    }, [dispatch, error, userId, user, navigate, isUpdated, updateError, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Admin: Update User | DhagaKart" />

            {updateLoading && <BackdropLoader />}

            {loading ? <Loading /> : (
                <>
                    <div className="bg-white rounded-xl overflow-hidden mx-auto w-lg max-w-xl">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                        <FiUser className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-800">Update User</h1>
                                        <p className="text-sm text-gray-500">Manage user details and permissions</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link 
                                        to="/admin/users" 
                                        className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        <span>Back to Users</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={updateUserSubmitHandler}
                            className="p-6"
                        >
                            <div className="space-y-6">

                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-700">Basic Information</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Required
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiUser className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    name="name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    InputProps={{
                                                        className: 'pl-10',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiMail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextField
                                                    fullWidth
                                                    label="Email"
                                                    type="email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    InputProps={{
                                                        className: 'pl-10',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gender Selection */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700">Gender</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <IoMdMale className="w-5 h-5 text-blue-600" />
                                            <IoMdFemale className="w-5 h-5 text-blue-600" />
                                            <RadioGroup
                                                row
                                                name="gender"
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                <FormControlLabel 
                                                    value="male" 
                                                    control={<Radio />} 
                                                    label="Male" 
                                                    className="text-gray-700"
                                                />
                                                <FormControlLabel 
                                                    value="female" 
                                                    control={<Radio />} 
                                                    label="Female" 
                                                    className="text-gray-700"
                                                />
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>

                                {/* Role and Avatar */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-700">User Role & Avatar</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiShield className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <TextField
                                                    fullWidth
                                                    label="Role"
                                                    select
                                                    required
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    InputProps={{
                                                        className: 'pl-10',
                                                    }}
                                                >
                                                    <MenuItem value="user">
                                                        <span className="flex items-center gap-2">
                                                            <span>User</span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                Default
                                                            </span>
                                                        </span>
                                                    </MenuItem>
                                                    <MenuItem value="admin">
                                                        <span className="flex items-center gap-2">
                                                            <span>Admin</span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Special
                                                            </span>
                                                        </span>
                                                    </MenuItem>
                                                </TextField>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <Avatar
                                                    alt="Avatar Preview"
                                                    src={avatarPreview}
                                                    sx={{ width: 56, height: 56, cursor: 'pointer' }}
                                                    className="hover:shadow-md transition-shadow"
                                                />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setAvatarPreview(reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button 
                                        type="submit" 
                                        disabled={updateLoading}
                                        className="flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updateLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <span>Update User</span>
                                        )}
                                    </button>
                                    <Link 
                                        to="/admin/users" 
                                        className="flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>

                        </form>

                    </div>
                </>
            )}
        </>
    );
};

export default UpdateUser;