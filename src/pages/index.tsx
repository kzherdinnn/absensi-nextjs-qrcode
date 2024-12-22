// pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, Box, Typography } from '@mui/material';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectToLogin = async () => {
      try {
        await router.replace('/login'); // Menggunakan replace agar tidak bisa kembali ke halaman ini
      } catch (error) {
        console.error('Gagal mengarahkan ke halaman login:', error);
      }
    };

    redirectToLogin();
  }, [router]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress color="primary" />
      <Typography variant="h6" mt={2} align="center">
        Sedang mengarahkan ke halaman login...
      </Typography>
    </Box>
  );
};

export default HomePage;
