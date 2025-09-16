// import { useEffect, useState, useRef } from 'react';
// import {
//   Box,
//   Grid,
//   Typography,
//   TextField,
//   Button,
//   useTheme,
//   Stepper,
//   Step,
//   StepLabel,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   InputAdornment,
//   Fade,
//   CircularProgress,
//   Autocomplete,
//   Paper
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import { toast } from 'react-hot-toast';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearErrors, registerUser } from '../../actions/userAction';
// import BackdropLoader from '../Layouts/BackdropLoader';
// import MetaData from '../Layouts/MetaData';
// import { indianCities } from '../../utils/indianCities';

// const Register = () => {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loading, isAuthenticated, error, success } = useSelector(state => state.user);

//   // Stepper state
//   const [activeStep, setActiveStep] = useState(0);

//   // City selection state
//   const [cityInput, setCityInput] = useState('');
//   const [filteredCities, setFilteredCities] = useState(indianCities);

//   // OAuth detection
//   const [isOAuth, setIsOAuth] = useState(false);

//   // Form state
//   const [user, setUser] = useState({
//     name: '',
//     email: '',
//     password: '',
//     cpassword: '',
//     phone: '',
//     city: '',
//     businessName: '',
//     businessType: '',
//   });

//   // Handle authentication errors and redirects
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearErrors());
//     }
//     if (isAuthenticated) {
//       navigate('/');
//     }
//   }, [error, isAuthenticated, dispatch, navigate]);

//   // Extract OAuth data from query parameters
//   useEffect(() => {
//     if (location.pathname === '/oauth-complete-registration') {
//       const searchParams = new URLSearchParams(location.search);
//       const name = decodeURIComponent(searchParams.get('name') || '');
//       const email = decodeURIComponent(searchParams.get('email') || '');

//       if (name && email) {
//         setIsOAuth(true);
//         setUser(u => ({ ...u, name, email }));
//       } else {
//         toast.error('Missing OAuth data. Please try again.');
//         navigate('/login');
//       }
//     }
//   }, [location.pathname, navigate]);

//   // Close city suggestions on click outside
//   useEffect(() => {
//     const handler = e => {
//       if (
//         cityInputRef.current &&
//         !cityInputRef.current.contains(e.target) &&
//         suggestionListRef.current &&
//         !suggestionListRef.current.contains(e.target)
//       ) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const handleDataChange = e => {
//     const { name, value } = e.target;
//     setUser(u => ({ ...u, [name]: value }));
//   };

//   const handleCityChange = (event, newValue) => {
//     setUser({ ...user, city: newValue || '' });
//     setCityInput(newValue || '');
//     setFilteredCities(
//       newValue 
//         ? indianCities.filter(city => 
//             city.toLowerCase().includes(newValue.toLowerCase())
//           )
//         : indianCities
//     );
//   };

//   const handleCityInputChange = (event, newInputValue) => {
//     setCityInput(newInputValue);
//     setFilteredCities(
//       indianCities.filter(city => 
//         city.toLowerCase().includes(newInputValue.toLowerCase())
//       )
//     );
//   };

//   const handleCityKeyDown = e => {
//     if (!showSuggestions) return;
//     if (e.key === 'Enter' && filteredCities.length > 0) {
//       setUser({ ...user, city: filteredCities[0] });
//     } else if (e.key === 'Escape') {
//       setShowSuggestions(false);
//     }
//   };

//   const highlightMatch = (text, query) => {
//     const idx = text.toLowerCase().indexOf(query.toLowerCase());
//     if (idx === -1) return text;
//     return (
//       <>
//         {text.slice(0, idx)}
//         <Typography component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
//           {text.slice(idx, idx + query.length)}
//         </Typography>
//         {text.slice(idx + query.length)}
//       </>
//     );
//   };

//   const steps = ['Personal Information', 'Business Details'];

//   const handleNext = () => {
//     if (activeStep === 0) {
//       const { name, email, password, cpassword, phone, city } = user;
//       if (!name || !email || !password || !cpassword || !phone || !city) {
//         toast.error('Please fill all required fields');
//         return;
//       }
//       if (password !== cpassword) {
//         toast.error("Passwords don't match");
//         return;
//       }
//     }
//     setActiveStep(s => s + 1);
//   };

//   const handleBack = () => setActiveStep(s => s - 1);

//   // Redirect to success page after successful registration
//   useEffect(() => {
//     if (success) {
//       // Navigate to success page
//       navigate('/register/success');
//     }
//   }, [success, navigate]);

//   const handleRegister = async e => {
//     e.preventDefault();
//     const { businessName, businessType } = user;
//     if (!businessName || !businessType) {
//       toast.error('Please fill all business details');
//       return;
//     }
//     const payload = {
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       city: user.city,
//       businessName,
//       businessType,
//       password: user.password
//     };
    
//     try {
//       toast.loading('Registering...');
//       await dispatch(registerUser(payload));
//       // The success effect will handle the navigation
//     } catch (error) {
//       // Error is already handled by Redux
//       console.error('Registration error:', error);
//     }
//   };

//   const personalFields = [
//     { xs: 6, field: 'name', label: 'Full Name' },
//     { xs: 6, field: 'email', label: 'Email Address', type: 'email', disabled: isOAuth },
//     { xs: 6, field: 'phone', label: 'Phone Number', type: 'tel' }
//   ];

//   return (
//     <>
//       <MetaData title="Register | DhagaKart" />
//       {loading && <BackdropLoader />}
//       <Box className="min-h-[80vh] mt-10 flex items-center justify-center p-4">
//         <Grid container component="main" className="max-w-6xl bg-white shadow-xl rounded-xl overflow-hidden">
//           <Grid item xs={12} md={5} sx={{ background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//             <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
//               A–Z Textile Hub
//             </Typography>
//             <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
//               Join DhagaKart today and discover a world of premium textile products.
//             </Typography>
//             <Box>
//               {['Secure Business Account', 'Premium Textile Selection', 'Dedicated Account Manager', '24/7 Business Support'].map((t, i) => (
//                 <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                   <CheckCircleOutlineIcon sx={{ color: 'warning.main' }} />
//                   <Typography sx={{ color: 'white' }}>{t}</Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={7} sx={{ p: 5 }}>
//             <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Create Business Account</Typography>
//             <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
//               Complete your registration in two simple steps
//             </Typography>
//             <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
//               {steps.map(label => (
//                 <Step key={label}>
//                   <StepLabel>{label}</StepLabel>
//                 </Step>
//               ))}
//             </Stepper>
//             <Box component="form" onSubmit={handleRegister}>
//               {activeStep === 0 && (
//                 <Grid container spacing={2}>
//                   {personalFields.map(({ xs, field, label, type, disabled }) => (
//                     <Grid item xs={12} sm={xs} key={field}>
//                       <TextField
//                         fullWidth
//                         label={label}
//                         name={field}
//                         type={type || 'text'}
//                         value={user[field]}
//                         onChange={handleDataChange}
//                         required
//                         disabled={disabled || false}
//                       />
//                     </Grid>
//                   ))}

//                   <Grid item xs={12} sm={6}>
//                     <Autocomplete
//                       options={filteredCities}
//                       value={user.city}
//                       inputValue={cityInput}
//                       onInputChange={handleCityInputChange}
//                       onChange={handleCityChange}
//                       freeSolo
//                       disableClearable
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="City"
//                           required
//                           InputProps={{
//                             ...params.InputProps,
//                             startAdornment: (
//                               <InputAdornment position="start">
//                                 <SearchIcon />
//                               </InputAdornment>
//                             ),
//                           }}
//                         />
//                       )}
//                       PaperComponent={({ children }) => (
//                         <Paper 
//                           elevation={3}
//                           sx={{
//                             mt: 1,
//                             borderRadius: 1,
//                             '& .MuiAutocomplete-listbox': {
//                               maxHeight: '200px',
//                               '&::-webkit-scrollbar': {
//                                 width: '6px',
//                               },
//                               '&::-webkit-scrollbar-track': {
//                                 background: '#f1f1f1',
//                               },
//                               '&::-webkit-scrollbar-thumb': {
//                                 background: '#888',
//                                 borderRadius: '3px',
//                               },
//                               '&::-webkit-scrollbar-thumb:hover': {
//                                 background: '#555',
//                               },
//                             },
//                           }}
//                         >
//                           {children}
//                         </Paper>
//                       )}
//                       ListboxProps={{
//                         style: {
//                           maxHeight: '200px',
//                         },
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Password"
//                       name="password"
//                       type="password"
//                       value={user.password}
//                       onChange={handleDataChange}
//                       required
//                       helperText="Min. 8 characters"
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Confirm Password"
//                       name="cpassword"
//                       type="password"
//                       value={user.cpassword}
//                       onChange={handleDataChange}
//                       required
//                     />
//                   </Grid>

//                   <Grid item xs={12} sx={{ textAlign: 'right' }}>
//                     <Button variant="contained" onClick={handleNext}>
//                       Continue
//                     </Button>
//                   </Grid>
//                 </Grid>
//               )}

//               {activeStep === 1 && (
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Business Name"
//                       name="businessName"
//                       value={user.businessName}
//                       onChange={handleDataChange}
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <FormControl 
//                       fullWidth 
//                       required
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           '& fieldset': {
//                             borderColor: 'rgba(0, 0, 0, 0.23)',
//                           },
//                           '&:hover fieldset': {
//                             borderColor: 'rgba(0, 0, 0, 0.87)',
//                           },
//                           '&.Mui-focused fieldset': {
//                             borderColor: theme.palette.primary.main,
//                             borderWidth: '1px',
//                           },
//                         },
//                         '& .MuiInputLabel-root': {
//                           backgroundColor: 'white',
//                           px: 1,
//                           '&.Mui-focused': {
//                             color: theme.palette.primary.main,
//                           },
//                         },
//                       }}
//                       variant="outlined"
//                     >
//                       <InputLabel id="business-type-label">Business Type</InputLabel>
//                       <Select
//                         name="businessType"
//                         labelId="business-type-label"
//                         label="Business Type"
//                         value={user.businessType}
//                         onChange={handleDataChange}
//                         sx={{
//                           '& .MuiSelect-select': {
//                             padding: '14px 14px',
//                           },
//                         }}
//                       >
//                         {['Retailer', 'Wholesaler', 'Manufacturer', 'Distributor', 'Designer', 'Other']
//                           .map(type => (
//                             <MenuItem key={type} value={type}>
//                               {type}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Button variant="outlined" onClick={handleBack}>
//                       Back
//                     </Button>
//                     <Button type="submit" variant="contained">
//                       Create Account
//                     </Button>
//                   </Grid>
//                 </Grid>
//               )}

//               <Typography sx={{ textAlign: 'center', mt: 3 }}>
//                 Already have an account?{' '}
//                 <Link to="/login" style={{ fontWeight: 600 }}>
//                   Sign In
//                 </Link>
//               </Typography>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default Register;

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
  CircularProgress,
  Autocomplete,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, registerUser } from '../../actions/userAction';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import { indianCities } from '../../utils/indianCities';
import { useMediaQuery } from '@mui/material';

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, error, success } = useSelector(state => state.user);

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // City selection state
  const [cityInput, setCityInput] = useState('');
  const [filteredCities, setFilteredCities] = useState(indianCities);

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

  // Validation state
  const [errors, setErrors] = useState({
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
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [error, isAuthenticated, dispatch, navigate]);

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
        toast.error('Missing OAuth data. Please try again.');
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  // Close city suggestions on click outside
  useEffect(() => {
    const handler = e => {
      if (
        cityInput.current &&
        !cityInput.current.contains(e.target) &&
        suggestionListRef.current &&
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
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    switch(fieldName) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Invalid email address';
        }
        break;

      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;

      case 'cpassword':
        if (!value.trim()) {
          error = 'Confirm password is required';
        } else if (value !== user.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;

      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        }
        break;

      case 'businessName':
        if (!value.trim()) {
          error = 'Business name is required';
        } else if (value.length < 3) {
          error = 'Business name must be at least 3 characters';
        }
        break;

      case 'businessType':
        if (!value.trim()) {
          error = 'Business type is required';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleCityChange = (event, newValue) => {
    setUser({ ...user, city: newValue || '' });
    setCityInput(newValue || '');
    setFilteredCities(
      newValue 
        ? indianCities.filter(city => 
            city.toLowerCase().includes(newValue.toLowerCase())
          )
        : indianCities
    );
    validateField('city', newValue || '');
  };

  const handleCityInputChange = (event, newInputValue) => {
    setCityInput(newInputValue);
    setFilteredCities(
      indianCities.filter(city => 
        city.toLowerCase().includes(newInputValue.toLowerCase())
      )
    );
  };

  const handleCityKeyDown = e => {
    if (!showSuggestions) return;
    if (e.key === 'Enter' && filteredCities.length > 0) {
      setUser({ ...user, city: filteredCities[0] });
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
      // Validate all fields
      validateField('name', name);
      validateField('email', email);
      validateField('password', password);
      validateField('cpassword', cpassword);
      validateField('phone', phone);
      validateField('city', city);
  
      // Gather all errors after validation
      const validationErrors = [
        errors.name,
        errors.email,
        errors.password,
        errors.cpassword,
        errors.phone,
        errors.city
      ].filter(Boolean);
  
      // Show the first error as a toast notification
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]);
        return;
      }
  
      setActiveStep(s => s + 1);
    }
  };

  const handleBack = () => setActiveStep(s => s - 1);

  // Redirect to success page after successful registration
  useEffect(() => {
    if (success) {
      // Navigate to success page
      navigate('/register/success');
    }
  }, [success, navigate]);

  const handleRegister = async e => {
    e.preventDefault();
    const { businessName, businessType } = user;

    // Validate business details
    validateField('businessName', businessName);
    validateField('businessType', businessType);

    if (Object.values(errors).some(error => error)) {
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
      await dispatch(registerUser(payload));
      // The success effect will handle the navigation
    } catch (error) {
      // Error is already handled by Redux
      console.error('Registration error:', error);
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
      <Box className="min-h-[80vh] mt-10 md:mt-16 md:mb-12 flex items-center justify-center p-4">
        <Grid container component="main" className="max-w-6xl bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Hide left section on mobile */}
          {!isMobile && (
            <Grid item xs={12} md={5} sx={{ background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                DhagaKart
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                Your OneStop Solution for Textile Manufacturing
              </Typography>
              <Box>
                {["Best Market Pricing", "Reliable On-Time Delivery", "Flexible Credit & Financing Options", "Bulk Order Benefits"].map((t, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleOutlineIcon sx={{ color: 'warning.main' }} />
                    <Typography sx={{ color: 'white' }}>{t}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={7} sx={{
            p: { xs: 2, sm: 5 },
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
            ...(isMobile && { boxShadow: 'none', borderRadius: 0 })
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.3rem', sm: '1.5rem' } }}>Create Business Account</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
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
                    <Autocomplete
                      options={filteredCities}
                      value={user.city}
                      inputValue={cityInput}
                      onInputChange={handleCityInputChange}
                      onChange={handleCityChange}
                      freeSolo
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City"
                          required
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      PaperComponent={({ children }) => (
                        <Paper 
                          elevation={3}
                          sx={{
                            mt: 1,
                            borderRadius: 1,
                            '& .MuiAutocomplete-listbox': {
                              maxHeight: '200px',
                              '&::-webkit-scrollbar': {
                                width: '6px',
                              },
                              '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                              },
                              '&::-webkit-scrollbar-thumb': {
                                background: '#888',
                                borderRadius: '3px',
                              },
                              '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555',
                              },
                            },
                          }}
                        >
                          {children}
                        </Paper>
                      )}
                      ListboxProps={{
                        style: {
                          maxHeight: '200px',
                        },
                      }}
                    />
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
