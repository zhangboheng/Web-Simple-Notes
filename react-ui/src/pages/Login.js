import React, { useState } from 'react';
import { login } from '../services/auth';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';

function Login() {
  const [loginNum, setUsername] = useState('');
  const [loginPwd, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ loginNum, loginPwd });
      if (response.data.message) {
        localStorage.setItem('token', response.data.token);
        setAlertMessage(response.data.showTips);
        setAlertSeverity('success');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setAlertMessage(response.data.showTips);
        setAlertSeverity('warning');
      };
    } catch (error) {
      setAlertMessage('An error occurred');
      setAlertSeverity('error');
    }
    setOpen(true);
  };

  // Close alert
  const handleClose = () => {
    setOpen(false);
    setAlertMessage('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionComponent={Grow}
      >
        {alertMessage && (
          <Alert severity={alertSeverity} onClose={() => setAlertMessage('')}>
            {alertMessage}
          </Alert>
        )}
      </Snackbar>
      <input
        type="username"
        value={loginNum}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        required
      />
      <input
        type="password"
        value={loginPwd}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;