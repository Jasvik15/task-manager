import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockOutlined sx={{ fontSize: 60, color: '#1e3c72', mb: 2 }} />
          <Typography variant="h5" component="h1" fontWeight={700} color="#1e3c72">
            Admin Access
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter password to access admin panel
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            required
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              py: 1.5,
              bgcolor: '#1e3c72',
              '&:hover': { bgcolor: '#2a5298' },
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Access Admin Panel
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button href="/dashboard" color="inherit" sx={{ textTransform: 'none' }}>
            ← Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;