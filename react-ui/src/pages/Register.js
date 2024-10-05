import React, { useState } from 'react';
import { register } from '../services/auth';
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
import backgroundImage from '../assets/images/register.jpg';

function Register() {
  const [loginName, setLoginName] = useState('');
  const [loginNum, setLoginNum] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ loginName, loginNum, loginPwd });
      if (response.data.message) {
        setAlertMessage(response.data.showTips || 'Login successful');
        setAlertSeverity('success');
        setOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setAlertMessage(response.data.showTips || 'Login failed');
        setAlertSeverity('warning');
        setOpen(true);
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'Oops, something went wrong');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAlertMessage('');
  };

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        boxSizing: 'border-box',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
          SIGNUP
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nickname"
            variant="outlined"
            fullWidth
            margin="normal"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <TextField
            label="Account"
            variant="outlined"
            fullWidth
            margin="normal"
            value={loginNum}
            onChange={(e) => setLoginNum(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={loginPwd}
            onChange={(e) => setLoginPwd(e.target.value)}
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
              size="large"
              sx={{ flex: 1 }}
            >
              Signup
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
        sx={{ position: 'absolute' }}
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

export default Register;
