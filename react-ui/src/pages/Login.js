import React, { useState } from 'react';
import { login } from '../services/auth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import Grow from '@mui/material/Grow';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/signup.jpg';

function Login() {
  const [loginNum, setUsernum] = useState('');
  const [loginPwd, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ loginNum, loginPwd });
      if (response.data.message) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userInfo', JSON.stringify([response.data.userInfo]));
        setAlertMessage(response.data.showTips || 'Login successful');
        setAlertSeverity('success');
        setOpen(true);
        setTimeout(() => {
          navigate('/notes');
        }, 2000);
      } else {
        setAlertMessage(response.data.showTips || 'Login failed');
        setAlertSeverity('warning');
        setOpen(true);
      }
    } catch (error) {
      setAlertMessage('Oops, something went wrong');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAlertMessage('');
  };


  const handleReturn = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          START
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Account"
            variant="outlined"
            fullWidth
            margin="normal"
            value={loginNum}
            onChange={(e) => setUsernum(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={loginPwd}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              mt: 2,
            }}
          >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ flex: 1 }}
          >
            Login
          </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ flex: 1 }}
              onClick={handleReturn}
            >
              Back
            </Button>
          </Box>
        </form>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionComponent={Grow}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alertSeverity}
          onClose={handleClose}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
