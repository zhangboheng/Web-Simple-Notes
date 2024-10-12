import React, { useState, useEffect } from 'react';
import { register, getCaptchaImage } from '../services/auth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grow from '@mui/material/Grow';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/register.jpg';

function Register() {
  const [loginName, setLoginName] = useState('');
  const [loginNum, setLoginNum] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const fetchCaptcha = async () => {
    try {
      const response = await getCaptchaImage();
      setCaptchaImage(`data:image/jpeg;base64,${response.data.captchaImage}`);
    } catch (error) {
      console.error('Error fetching captcha:', error);
      setAlertMessage('Error fetching captcha. Please try again.');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ loginName, loginNum, loginPwd, captcha: captchaInput });
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
        fetchCaptcha();
      }
    } catch (error) {
      let tips = JSON.parse(error.request.response).showTips
      setAlertMessage(tips);
      setAlertSeverity('error');
      setOpen(true);
      fetchCaptcha();
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
          /><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <TextField
            label="Captcha"
            variant="outlined"
            margin="normal"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            required
            sx={{ width: '150px', marginRight: 2, marginTop: 1 }}
            InputProps={{
              sx: { 
                height: '50px',
               },
            }}
          />
          {captchaImage && (
            <img src={captchaImage} alt="Captcha" style={{ marginRight: 8, height: 50, border: '1px solid #ccc' }} />
          )}
          <IconButton onClick={fetchCaptcha}>
            <RefreshIcon />
          </IconButton>
        </Box>
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
