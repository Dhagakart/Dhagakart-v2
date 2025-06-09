import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearErrors } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import FormSidebar from './FormSidebar';
import { Grid, Box, Typography, TextField, Button } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useParams();

  const { error, success, loading } = useSelector((state) => state.forgotPassword);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      enqueueSnackbar('Password length must be at least 8 characters', { variant: 'warning' });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }
    const formData = new FormData();
    formData.set('password', newPassword);
    formData.set('confirmPassword', confirmPassword);
    dispatch(resetPassword(token, formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Password Updated Successfully', { variant: 'success' });
      navigate('/login');
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Reset Password | DhagaKart" />
      {loading && <BackdropLoader />}
      <main className="w-full min-h-[80vh] mt-10 flex justify-center items-center">
        <div className="flex rounded-xl sm:w-4/6 sm:mt-6 m-auto mb-7 bg-white shadow-lg">
          {/* Left Info Panel */}
          <Grid item xs={12} md={5} sx={{ background: 'linear-gradient(135deg, #00264d 0%, #003366 100%)', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '8px 0 0 8px' }}>
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

          {/* Right Form Panel */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 6,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '0 8px 8px 0',
            }}
          >
            <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
              Create a New Password
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                size="small"
              />
            </Box>
            <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
              By continuing, you agree to our{' '}
              <Link to="/terms" style={{ color: '#003366' }}>
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link to="/privacy" style={{ color: '#003366' }}>
                Privacy Policy
              </Link>.
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#003366',
                mt: 3,
                py: 1.5,
                textTransform: 'none',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            >
              Submit
            </Button>

            {/* <Link to="/login" style={{ marginTop: '16px', textAlign: 'center', color: '#003366', fontWeight: 500 }}>
              Back to Login
            </Link> */}
          </Box>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
