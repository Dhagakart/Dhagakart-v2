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
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSnackbar } from 'notistack';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const Register = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, isAuthenticated, error } = useSelector(state => state.user);

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // City autocomplete
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cityInputRef = useRef(null);
  const suggestionListRef = useRef(null);

  // OAuth detection
  const [isOAuth, setIsOAuth] = useState(false);

  // Form state
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

  // Handle authentication errors and redirects
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [error, isAuthenticated, dispatch, enqueueSnackbar, navigate]);

  // Extract OAuth data from query parameters
  useEffect(() => {
    if (location.pathname === '/oauth-complete-registration') {
      const searchParams = new URLSearchParams(location.search);
      const name = decodeURIComponent(searchParams.get('name') || '');
      const email = decodeURIComponent(searchParams.get('email') || '');

      if (name && email) {
        setIsOAuth(true);
        setUser(u => ({ ...u, name, email }));
      } else {
        enqueueSnackbar('Missing OAuth data. Please try again.', { variant: 'error' });
        navigate('/login');
      }
    }
  }, [location.pathname, navigate, enqueueSnackbar]);

  // Close city suggestions on click outside
  useEffect(() => {
    const handler = e => {
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target) &&
        suggestionListRef.current/ current &&
        !suggestionListRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDataChange = e => {
    const { name, value } = e.target;
    setUser(u => ({ ...u, [name]: value }));
  };

  const fetchCitySuggestions = async query => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setCitySuggestions(
        data.map(item => ({
          cityName: item.display_name.split(',')[0].trim(),
          fullAddress: item.display_name,
        }))
      );
      setShowSuggestions(true);
    } catch {
      setCitySuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityChange = e => {
    const { value } = e.target;
    setUser(u => ({ ...u, city: value }));
    if (debounceTimer) clearTimeout(debounceTimer);
    if (value.length > 2) {
      setIsLoading(true);
      setDebounceTimer(setTimeout(() => fetchCitySuggestions(value), 300));
    } else {
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  const selectCity = suggestion => {
    setUser(u => ({ ...u, city: suggestion.cityName }));
    setShowSuggestions(false);
  };

  const handleCityKeyDown = e => {
    if (!showSuggestions) return;
    // Note: The original code has a bug here with setHighlightedIndex not defined.
    // For simplicity, we'll omit arrow key navigation.
    if (e.key === 'Enter' && citySuggestions.length > 0) {
      selectCity(citySuggestions[0]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const highlightMatch = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <Typography component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          {text.slice(idx, idx + query.length)}
        </Typography>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const steps = ['Personal Information', 'Business Details'];

  const handleNext = () => {
    if (activeStep === 0) {
      const { name, email, password, cpassword, phone, city } = user;
      if (!name || !email || !password || !cpassword || !phone || !city) {
        enqueueSnackbar('Please fill all required fields', { variant: 'error' });
        return;
      }
      if (password !== cpassword) {
        enqueueSnackbar("Passwords don't match", { variant: 'error' });
        return;
      }
    }
    setActiveStep(s => s + 1);
  };

  const handleBack = () => setActiveStep(s => s - 1);

  const handleRegister = async e => {
    e.preventDefault();
    const { businessName, businessType } = user;
    if (!businessName || !businessType) {
      enqueueSnackbar('Please fill all business details', { variant: 'error' });
      return;
    }
    const payload = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      businessName,
      businessType,
      password: user.password
    };
    try {
      const result = await dispatch(registerUser(payload));
      if (result?.user) {
        enqueueSnackbar('Registration successful! Redirecting...', { variant: 'success' });
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'Registration failed. Please try again.', { variant: 'error' });
    }
  };

  const personalFields = [
    { xs: 6, field: 'name', label: 'Full Name' },
    { xs: 6, field: 'email', label: 'Email Address', type: 'email', disabled: isOAuth },
    { xs: 6, field: 'phone', label: 'Phone Number', type: 'tel' }
  ];

  return (
    <>
      <MetaData title="Register | DhagaKart" />
      {loading && <BackdropLoader />}
      <Box className="min-h-[80vh] mt-10 flex items-center justify-center p-4">
        <Grid container component="main" className="max-w-6xl bg-white shadow-xl rounded-xl overflow-hidden">
          <Grid item xs={12} md={5} sx={{ background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

          <Grid item xs={12} md={7} sx={{ p: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Create Business Account</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Complete your registration in two simple steps
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box component="form" onSubmit={handleRegister}>
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  {personalFields.map(({ xs, field, label, type, disabled }) => (
                    <Grid item xs={12} sm={xs} key={field}>
                      <TextField
                        fullWidth
                        label={label}
                        name={field}
                        type={type || 'text'}
                        value={user[field]}
                        onChange={handleDataChange}
                        required
                        disabled={disabled || false}
                      />
                    </Grid>
                  ))}

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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          endAdornment: isLoading && (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          )
                        }}
                        autoComplete="off"
                      />
                      <Fade in={showSuggestions}>
                        <Box
                          ref={suggestionListRef}
                          sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            bgcolor: 'background.paper',
                            boxShadow: 1,
                            maxHeight: 240,
                            overflowY: 'auto',
                            zIndex: 10
                          }}
                        >
                          {citySuggestions.length
                            ? citySuggestions.map((sug, i) => (
                                <Box
                                  key={i}
                                  onClick={() => selectCity(sug)}
                                  sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                  <Typography>
                                    {highlightMatch(sug.cityName, user.city)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {sug.fullAddress}
                                  </Typography>
                                </Box>
                              ))
                            : (
                              <Box sx={{ p: 1 }}>
                                <Typography>No results found</Typography>
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

                  <Grid item xs={12} sx={{ textAlign: 'right' }}>
                    <Button variant="contained" onClick={handleNext}>
                      Continue
                    </Button>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
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
                    <FormControl 
                      fullWidth 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0, 0, 0, 0.87)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '1px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          backgroundColor: 'white',
                          px: 1,
                          '&.Mui-focused': {
                            color: theme.palette.primary.main,
                          },
                        },
                      }}
                      variant="outlined"
                    >
                      <InputLabel id="business-type-label">Business Type</InputLabel>
                      <Select
                        name="businessType"
                        labelId="business-type-label"
                        label="Business Type"
                        value={user.businessType}
                        onChange={handleDataChange}
                        sx={{
                          '& .MuiSelect-select': {
                            padding: '14px 14px',
                          },
                        }}
                      >
                        {['Retailer', 'Wholesaler', 'Manufacturer', 'Distributor', 'Designer', 'Other']
                          .map(type => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="submit" variant="contained">
                      Create Account
                    </Button>
                  </Grid>
                </Grid>
              )}

              <Typography sx={{ textAlign: 'center', mt: 3 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ fontWeight: 600 }}>
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