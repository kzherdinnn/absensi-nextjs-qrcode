import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import { loginApi, profil } from '@/services/siswaApi';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '@/services/store';
import { useRouter } from 'next/router';
import { getToken, setToken } from '@/services/configService';
import { motion, AnimatePresence } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'error' as 'error' | 'success' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;

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

  const handleLogout = React.useCallback(() => {
    localStorage.clear();
    setToken('');
    dispatch(setData({}));
    router.replace('/login', undefined, { shallow: true });
  }, [dispatch, router]);

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
  }, [query, ambilProfil, router, handleLogout]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setAlert({ open: true, message: 'Email dan password wajib diisi!', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));

      const respon = await loginApi(email, password);
      if (respon?.token) {
        setToken(respon.token);
        localStorage.setItem('token', respon.token);
        setAlert({ open: true, message: 'Login Berhasil!', severity: 'success' });

        if (await ambilProfil()) {
          router.push('/profil');
        }
      }
    } catch (error) {
      setAlert({ open: true, message: 'Email atau password salah!', severity: 'error' });
      console.error('Kesalahan saat login:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <SecurityIcon fontSize="large" />, title: 'Aman', desc: 'Enkripsi end-to-end', color: '#10b981' },
    { icon: <SpeedIcon fontSize="large" />, title: 'Cepat', desc: 'Real-time tracking', color: '#3b82f6' },
    { icon: <CloudDoneIcon fontSize="large" />, title: 'Cloud', desc: 'Akses dimana saja', color: '#ec4899' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Shapes */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4, position: 'relative', zIndex: 1 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            width: '100%',
            maxWidth: 1100,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: '600px'
          }}
        >
          {/* Left Side - Branding */}
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative circles */}
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <FingerprintIcon sx={{ fontSize: 70 }} />
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Absensi Digital
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 5 }}>
                  Sistem Manajemen Kehadiran Modern
                </Typography>
              </motion.div>

              <Stack spacing={3} sx={{ mt: 4 }}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {feature.icon}
                      </Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" fontWeight="bold">{feature.title}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>{feature.desc}</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* Right Side - Login Form */}
          <Box
            sx={{
              flex: 1,
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                Selamat Datang! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Silakan login untuk melanjutkan ke dashboard
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#6366f1',
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                        boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Masuk Sekarang'}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  © 2026 Aplikasi Absensi. All rights reserved.
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginPage;
