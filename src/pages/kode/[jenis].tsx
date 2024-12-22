import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import QRCode from 'qrcode.react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ambilKode } from '@/services/kehadiranApi';
import { WS_BASE_URL } from '@/services/configService';

function QRCodePage() {
  const [dataKode, setKode] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true); // State loading untuk menunggu data
  const router = useRouter();
  const { jenis } = router.query;

  const data = useSelector((state: any) => state.data.data);

  const kodeAbsen = async () => {
    try {
      setLoading(true); // Mulai loading ketika ambil kode
      const respon = await ambilKode();
      if (respon?.data?.kode) {
        setKode(JSON.stringify({ kode: respon.data.kode, jenis }));
      } else {
        console.error('Kode tidak ditemukan.');
      }
    } catch (error) {
      console.error('Error ambil kode:', error);
    } finally {
      setLoading(false); // Akhiri loading setelah mendapatkan respon
    }
  };

  useEffect(() => {
    if (typeof data.peran !== 'string' || data.peran !== 'admin') {
      router.push('/');
      return;
    }

    if (!jenis) {
      router.push('/');
      return;
    }

    kodeAbsen();

    const ws = new WebSocket(WS_BASE_URL);
    setSocket(ws);

    ws.addEventListener('message', (event) => {
      console.log('WebSocket message received:', event.data);
      kodeAbsen();
    });

    // Cleanup saat komponen dilepas
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [data, jenis, router]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      padding={8}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" align="center">
          Absen {jenis === 'datang' ? 'Datang' : 'Pulang'}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            {dataKode ? (
              <QRCode value={dataKode} />
            ) : (
              <Typography variant="body1" color="error" align="center">
                Kode tidak tersedia
              </Typography>
            )}
          </div>
        )}

        <Typography variant="h6" align="center" style={{ marginTop: 20 }}>
          {dataKode || 'Menunggu kode...'}
        </Typography>
      </Container>
    </Box>
  );
}

export default QRCodePage;
