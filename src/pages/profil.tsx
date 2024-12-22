// ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Box } from '@mui/material';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

interface UserProfile {
  nama: string;
  email: string;
  peran: string;
}

const ProfilePage: React.FC = () => {
  const data = useSelector((state: any) => state.data.data);
  const router = useRouter();
  
  // State untuk menangani loading dan error
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const cekProfil = async () => {
      if (!data || !data.nama) {
        // Jika data tidak tersedia, arahkan ke halaman login
        router.push('/login');
        return;
      }
      setUser(data);  // Menyimpan data profil ke state
      setIsLoading(false);  // Set loading false setelah data siap
    };
    cekProfil();
  }, [data, router]);

  if (isLoading) {
    // Menampilkan loading spinner sebelum data siap
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // Jika profil kosong, tampilkan pesan error atau redirect
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          Terjadi kesalahan, data profil tidak ditemukan.
        </Typography>
      </Container>
    );
  }

  return (
    <Layout>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profil
          </Typography>
          <Typography variant="body1">
            <strong>Nama:</strong> {user.nama}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1">
            <strong>Peran:</strong> {user.peran}
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ProfilePage;
