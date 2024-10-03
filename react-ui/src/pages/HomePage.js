import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/thumbnail.jpg';

function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Typography variant="h3" component="h2" color="black" align="center"
        sx={{
          position: 'relative',
          top: '20px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
        Web Simple Notes
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          bottom: 50,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ width: 150 }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRegister}
          sx={{ width: 150 }}
        >
          Signup
        </Button>
      </Box>
    </Box>
  );
}

export default HomePage;