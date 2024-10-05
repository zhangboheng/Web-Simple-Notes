import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/NotesPage';
import theme from './theme';
import NotFound from './pages/NotFound';
import PrivateRoute from './services/privateRoute'; 

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<PrivateRoute element={<Notes />} />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;