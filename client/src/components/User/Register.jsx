import { useEffect, useState, useRef } from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    useTheme,
    Stepper,
    Step,
    StepLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import CircularProgress from '@mui/material/CircularProgress';

const Register = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const cityInputRef = useRef(null);
    const suggestionListRef = useRef(null);

    const { loading, isAuthenticated, error } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: '',
        phone: '',
        city: '',
        businessName: '',
        businessType: '',
    });

    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate('/');
        }
    }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                cityInputRef.current &&
                !cityInputRef.current.contains(event.target) &&
                suggestionListRef.current &&
                !suggestionListRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleCityChange = (e) => {
        const { value } = e.target;
        setUser({ ...user, city: value });
        setHighlightedIndex(-1);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        if (value.length > 2) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                fetchCitySuggestions(value);
            }, 300);
            setDebounceTimer(timer);
        } else {
            setShowSuggestions(false);
            setIsLoading(false);
        }
    };

    const fetchCitySuggestions = async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
            const data = await response.json();
            const cities = data.map(item => ({
                cityName: item.display_name.split(',')[0].trim(),
                fullAddress: item.display_name,
            }));
            setCitySuggestions(cities);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
            setCitySuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoading(false);
        }
    };

    const selectCity = (suggestion) => {
        setUser({ ...user, city: suggestion.cityName });
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    };

    const handleCityKeyDown = (e) => {
        if (!showSuggestions || citySuggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => 
                prev < citySuggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => 
                prev > 0 ? prev - 1 : citySuggestions.length - 1
            );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            selectCity(citySuggestions[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }
    };

    const highlightMatch = (text, query) => {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;
        const beforeMatch = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const afterMatch = text.substring(index + query.length);
        return (
            <>
                {beforeMatch}
                <Typography component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {match}
                </Typography>
                {afterMatch}
            </>
        );
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!user.name || !user.email || !user.password || !user.cpassword || !user.phone || !user.city) {
                enqueueSnackbar('Please fill all required fields', { variant: 'error' });
                return;
            }

            if (user.password.length < 8) {
                enqueueSnackbar('Password must be at least 8 characters', { variant: 'error' });
                return;
            }

            if (user.password !== user.cpassword) {
                enqueueSnackbar("Passwords don't match", { variant: 'error' });
                return;
            }
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate business details
        if (!user.businessName || !user.businessType) {
            enqueueSnackbar('Please fill all business details', { variant: 'error' });
            return;
        }

        // Validate password match
        if (user.password !== user.cpassword) {
            enqueueSnackbar("Passwords don't match", { variant: 'error' });
            return;
        }

        try {
            // Create user data object
            const userData = {
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                city: user.city,
                businessName: user.businessName,
                businessType: user.businessType
            };

            // Dispatch register action and wait for it to complete
            const result = await dispatch(registerUser(userData));
            
            if (result?.user) {
                // Show success message
                enqueueSnackbar('Registration successful! Redirecting...', { variant: 'success' });
                
                // Redirect to home page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
            
        } catch (error) {
            // Log the error for debugging
            console.error('Registration error:', error);
            
            // Show error message from the server or a default message
            if (error.message) {
                enqueueSnackbar(error.message, { variant: 'error' });
            } else {
                enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
            }
        }
    };

    const steps = ['Personal Information', 'Business Details'];

    return (
        <>
            <MetaData title="Register | DhagaKart" />
            {loading && <BackdropLoader />}
            <Box className="min-h-[80vh] mt-10 flex items-center justify-center p-4">
                <Grid
                    container
                    component="main"
                    className="max-w-6xl bg-white shadow-xl rounded-xl overflow-hidden"
                    sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}
                >
                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)',
                            padding: { xs: 3, md: 4 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ color: 'white', fontWeight: 700, mb: 2 }}
                        >
                            A–Z Textile Hub
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                            Join DhagaKart today and discover a world of premium textile products.
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[
                                'Secure Business Account',
                                'Premium Textile Selection',
                                'Dedicated Account Manager',
                                '24/7 Business Support'
                            ].map((text, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <CheckCircleOutlineIcon
                                        fontSize="medium"
                                        sx={{ color: theme.palette.warning.main }}
                                    />
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                        {text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                            padding: { xs: 3, sm: 4, md: 5 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                            Create Business Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Complete your registration in two simple steps
                        </Typography>

                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box
                            component="form"
                            onSubmit={handleRegister}
                            encType="multipart/form-data"
                            sx={{ '& .MuiTextField-root': { mb: 2 } }}
                        >
                            {activeStep === 0 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={user.name}
                                                onChange={handleDataChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                name="email"
                                                type="email"
                                                value={user.email}
                                                onChange={handleDataChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                type="tel"
                                                value={user.phone}
                                                onChange={handleDataChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ position: 'relative' }} ref={cityInputRef}>
                                                <TextField
                                                    fullWidth
                                                    label="City"
                                                    name="city"
                                                    value={user.city}
                                                    onChange={handleCityChange}
                                                    onKeyDown={handleCityKeyDown}
                                                    required
                                                    autoComplete="off"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon sx={{ color: 'text.secondary' }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: isLoading && (
                                                            <InputAdornment position="end">
                                                                <CircularProgress size={20} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    aria-autocomplete="list"
                                                    aria-controls="city-suggestions"
                                                    aria-expanded={showSuggestions}
                                                />
                                                <Fade in={showSuggestions}>
                                                    <Box
                                                        id="city-suggestions"
                                                        ref={suggestionListRef}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            left: 0,
                                                            right: 0,
                                                            zIndex: 10,
                                                            bgcolor: 'background.paper',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                            borderRadius: 2,
                                                            mt: 1,
                                                            maxHeight: 240,
                                                            overflowY: 'auto',
                                                            border: '1px solid',
                                                            borderColor: 'grey.200',
                                                        }}
                                                    >
                                                        {citySuggestions.length > 0 ? (
                                                            citySuggestions.map((suggestion, index) => (
                                                                <Box
                                                                    key={index}
                                                                    onClick={() => selectCity(suggestion)}
                                                                    sx={{
                                                                        p: 1.5,
                                                                        cursor: 'pointer',
                                                                        bgcolor: highlightedIndex === index ? 'action.selected' : 'transparent',
                                                                        '&:hover': { bgcolor: 'action.hover' },
                                                                        transition: 'background-color 0.2s ease',
                                                                        borderBottom:
                                                                            index !== citySuggestions.length - 1
                                                                                ? '1px solid'
                                                                                : 'none',
                                                                        borderColor: 'grey.200',
                                                                    }}
                                                                    role="option"
                                                                    aria-selected={highlightedIndex === index}
                                                                >
                                                                    <Typography variant="body2">
                                                                        {highlightMatch(suggestion.cityName, user.city)}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        noWrap
                                                                        sx={{ display: 'block', mt: 0.5 }}
                                                                    >
                                                                        {suggestion.fullAddress}
                                                                    </Typography>
                                                                </Box>
                                                            ))
                                                        ) : (
                                                            <Box sx={{ p: 1.5, textAlign: 'center' }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    No results found
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Fade>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                name="password"
                                                type="password"
                                                value={user.password}
                                                onChange={handleDataChange}
                                                required
                                                helperText="Min. 8 characters"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                name="cpassword"
                                                type="password"
                                                value={user.cpassword}
                                                onChange={handleDataChange}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                bgcolor: '#003366',
                                                '&:hover': { bgcolor: '#00264d' },
                                            }}
                                        >
                                            Continue
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            {activeStep === 1 && (
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Business Name"
                                                name="businessName"
                                                value={user.businessName}
                                                onChange={handleDataChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth required>
                                                <InputLabel>Business Type</InputLabel>
                                                <Select
                                                    name="businessType"
                                                    value={user.businessType}
                                                    label="Business Type"
                                                    onChange={handleDataChange}
                                                >
                                                    <MenuItem value="Retailer">Retailer</MenuItem>
                                                    <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                                                    <MenuItem value="Manufacturer">Manufacturer</MenuItem>
                                                    <MenuItem value="Distributor">Distributor</MenuItem>
                                                    <MenuItem value="Designer">Designer</MenuItem>
                                                    <MenuItem value="Other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleBack}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderColor: '#003366',
                                                color: '#003366',
                                                '&:hover': { borderColor: '#00264d' },
                                            }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                bgcolor: '#003366',
                                                '&:hover': { bgcolor: '#00264d' },
                                            }}
                                        >
                                            Create Business Account
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#003366',
                                        fontWeight: 600,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Register;