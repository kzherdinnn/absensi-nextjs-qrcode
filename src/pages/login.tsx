import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { loginApi, profil } from '@/services/pegawaiApi';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '@/services/store';
import { useRouter } from 'next/router';
import { getToken, setToken } from '@/services/configService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;

  const data = useSelector((state: any) => state.data.data);

  // Fungsi untuk mengambil profil
  const ambilProfil = useCallback(async () => {
    try {
      if (!getToken()) {
        const token = localStorage.getItem('token');
        if (!token) return false;
        setToken(token);
      }

      const respon = await profil();
      if (respon?.data) {
        dispatch(setData(respon.data));
        return !!respon.data.peran;
      }
    } catch (error) {
      console.error('Kesalahan mengambil profil:', error);
    }
    return false;
  }, [dispatch]);

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    dispatch(setData({}));
    router.replace('/login');
  };

  // Cek jika sudah login atau logout
  useEffect(() => {
    const fetchData = async () => {
      const respon = await ambilProfil();
      if (respon) {
        router.push('/profil');
      }
    };

    if (query.logout !== undefined) {
      handleLogout();
    } else {
      fetchData();
    }
  }, [query, ambilProfil, router]);

  // Fungsi menangani login
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setAlert({ open: true, message: 'Email dan password wajib diisi!' });
      return;
    }

    setLoading(true);
    try {
      const respon = await loginApi(email, password);
      if (respon?.token) {
        setToken(respon.token);
        localStorage.setItem('token', respon.token);
        if (await ambilProfil()) {
          router.push('/profil');
        }
      }
    } catch (error) {
      setAlert({ open: true, message: 'Email atau password salah!' });
      console.error('Kesalahan saat login:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box textAlign="center" mt={2}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            )}
          </Box>
        </form>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity="error" variant="filled">
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default LoginPage;
