
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Box,
  Paper,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import Layout from '@/components/Layout';
import { registrasiSiswa } from '@/services/siswaApi';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function RegistrasiSiswa() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    peran: 'Siswa'
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [prop]: event.target.value });
  };

  const handlePeranChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeran: string | null
  ) => {
    if (newPeran !== null) {
      setFormData({ ...formData, peran: newPeran });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await registrasiSiswa(formData.nama, formData.email, formData.password, formData.peran);
      setAlert({ open: true, message: 'Registrasi Siswa Berhasil!', severity: 'success' });
      setFormData({ nama: '', email: '', password: '', peran: 'Siswa' });
    } catch (error) {
      setAlert({ open: true, message: 'Gagal melakukan registrasi.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom component={motion.h4} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Registrasi Siswa Baru
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component={motion.p} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            Tambahkan anggota baru ke dalam sistem absensi
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: { md: '1px solid #eee' } }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  color: 'white'
                }}
              >
                <HowToRegIcon sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Buat Akun Siswa
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Pastikan data yang dimasukkan sudah benar. Password default dapat diubah oleh Siswa nantinya.
              </Typography>
            </Grid>

            <Grid item xs={12} md={7}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nama Lengkap"
                      value={formData.nama}
                      onChange={handleChange('nama')}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><BadgeIcon color="action" /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email Siswa"
                      type="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange('password')}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>Peran Pengguna</Typography>
                    <ToggleButtonGroup
                      value={formData.peran}
                      exclusive
                      onChange={handlePeranChange}
                      fullWidth
                      color="primary"
                    >
                      <ToggleButton value="Siswa" sx={{ py: 1.5 }}>
                        <PersonIcon sx={{ mr: 1 }} /> Siswa
                      </ToggleButton>
                      <ToggleButton value="admin" sx={{ py: 1.5 }}>
                        <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      fullWidth
                      disabled={loading}
                      sx={{ mt: 2, py: 1.5, borderRadius: 2, fontSize: '1rem' }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Daftarkan Siswa'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} variant="filled">
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}

export default RegistrasiSiswa;
