
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, CircularProgress, Container, Typography, Paper, useTheme, Fade } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react'; // Using SVG for better scaling
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ambilKode } from '@/services/kehadiranApi';
import { WS_BASE_URL } from '@/services/configService';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Layout from '@/components/Layout';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function QRCodePage() {
  const [dataKode, setKode] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const router = useRouter();
  const { jenis } = router.query;
  const theme = useTheme();

  const data = useSelector((state: any) => state.data.data);
  const eventString = jenis === 'datang' ? 'Check In' : 'Check Out';

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kodeAbsen = useCallback(async () => {
    try {
      // Don't set full page loading on refresh to avoid flickering, just update code
      const respon = await ambilKode();
      console.log('Ambil Kode Respon:', respon);
      if (respon?.data?.kode) {
        const codeString = JSON.stringify({ kode: respon.data.kode, jenis: jenis });
        console.log('Set Data Kode:', codeString);
        setKode(codeString);
        setLoading(false);
      } else {
        console.warn('Kode tidak ditemukan dalam respon');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error ambil kode:', error);
      setLoading(false);
    }
  }, [jenis]);

  useEffect(() => {
    if (data?.peran !== 'admin') {
      if (data?.peran) router.push('/profil'); // Redirect if not admin
      // else router.push('/login'); // Allow loading if waiting for profil?
      // But assuming data is ready. If empty, maybe wait?
      // For now, assume if not admin, redirect.
      return;
    }

    if (!jenis) return;

    kodeAbsen();

    let ws: WebSocket;
    try {
      ws = new WebSocket(WS_BASE_URL);
      ws.onopen = () => console.log('WS Connected');
      ws.onmessage = (msg) => {
        console.log("New code signal received", msg.data);
        kodeAbsen();
      };
    } catch (e) { console.error(e); }

    return () => {
      if (ws) ws.close();
    };
  }, [data, jenis, router, kodeAbsen]);

  if (!jenis) return null;

  return (
    <Layout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 2
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 6,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: 600,
              width: '100%'
            }}
          >
            {/* Decorative Circles */}
            <Box sx={{ position: 'absolute', top: -50, left: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
              {eventString}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 4, opacity: 0.9 }}>
              <AccessTimeIcon />
              <Typography variant="h5" color="inherit">
                {currentTime || '--:--:--'}
              </Typography>
            </Box>

            <Box
              sx={{
                background: 'white',
                p: 3,
                borderRadius: 4,
                display: 'inline-block',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                minWidth: 300,
                minHeight: 300
              }}
            >
              {loading ? (
                <Box sx={{ width: 250, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : dataKode ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <QRCodeSVG value={dataKode} size={250} level={"H"} includeMargin={true} />
                </Box>
              ) : (
                <Box sx={{ width: 250, height: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                  <EventAvailableIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                  <Typography color="error" variant="body1">Kode Tidak Tersedia</Typography>
                  <Typography variant="caption" color="text.secondary">Periksa koneksi atau server</Typography>
                </Box>
              )}
            </Box>

            <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
              Silakan scan QR Code ini menggunakan aplikasi untuk melakukan absensi {jenis}.
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.6 }}>
              Kode diperbarui secara otomatis
            </Typography>

          </Paper>
        </motion.div>
      </Box>
    </Layout>
  );
}

export default QRCodePage;
