import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Typography,
  Paper,
  Button,
  useTheme,
  Alert,
  CircularProgress,
  Container,
  Stack
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import StopIcon from '@mui/icons-material/Stop';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import QrScanner from 'qr-scanner';
import Layout from '@/components/Layout';
import { absenKehadiran } from '@/services/kehadiranApi';
import { ubahTanggal } from '@/services/utils';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SecurityIcon from '@mui/icons-material/Security';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';

const AbsensiScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mountSafe, setMountSafe] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const theme = useTheme();

  const handleScan = async (result: QrScanner.ScanResult) => {
    if (result && result.data) {
      stopScanner();
      setLoading(true);
      try {
        let parsedData;
        try {
          parsedData = JSON.parse(result.data);
        } catch (e) {
          throw new Error('Format QR Code tidak valid');
        }

        const response = await absenKehadiran(parsedData.kode, parsedData.jenis);

        if (response?.data) {
          const timestamp = response.data[parsedData.jenis] || new Date().toISOString();
          const formattedDate = ubahTanggal(timestamp);
          setScanResult(`Berhasil Absen ${parsedData.jenis || ''} pada ${formattedDate}`);
          setError(null);
        } else {
          setScanResult('Absen tercatat, namun data respon tidak lengkap.');
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal melakukan absensi. Coba lagi.');
        setScanResult(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const startScanner = async () => {
    setError(null);
    setScanResult(null);

    // 1. Check if browser supports camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Kamera tidak didukung pada browser ini. Harap gunakan browser modern.');
      return;
    }

    // 2. Check for HTTPS (Secure Context)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setError('Akses kamera memerlukan koneksi HTTPS yang aman.');
      return;
    }

    setLoading(true);
    try {
      // 3. Explicitly request permission first
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasPermission(true);

      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());

      // 4. Start Scanner
      setIsScanning(true);
      setTimeout(async () => {
        if (videoRef.current) {
          try {
            scannerRef.current = new QrScanner(
              videoRef.current,
              handleScan,
              {
                onDecodeError: () => { },
                highlightScanRegion: true,
                highlightCodeOutline: true,
                maxScansPerSecond: 2,
              }
            );
            await scannerRef.current.start();
          } catch (e) {
            console.error(e);
            setError('Gagal memulai scanner. Silakan muat ulang halaman.');
            setIsScanning(false);
          }
        }
      }, 300);
    } catch (e: any) {
      console.error('Camera Permission Error:', e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setError('Izin kamera ditolak. Harap berikan izin di pengaturan browser Anda.');
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        setError('Kamera tidak ditemukan pada perangkat ini.');
      } else {
        setError('Gagal mengakses kamera: ' + (e.message || 'Error tidak diketahui'));
      }
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    setMountSafe(true);
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight="800" sx={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Absensi Scanner
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ opacity: 0.8 }}>
              Pindai QR Code untuk mencatat kehadiran Anda
            </Typography>
          </Box>
        </motion.div>

        <Paper
          elevation={0}
          component={motion.div}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          sx={{
            width: '100%',
            maxWidth: 600,
            p: 0,
            borderRadius: 6,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 450,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: isScanning ? '#000' : 'white',
            boxShadow: theme.shadows[10],
            border: `1px solid ${isScanning ? '#333' : 'rgba(0,0,0,0.05)'}`
          }}
        >
          <AnimatePresence mode='wait'>
            {!isScanning && !scanResult && !loading && !error && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 40 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4
                  }}
                >
                  <QrCodeScannerIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Kamera Siap
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 300 }}>
                  Gunakan kamera perangkat Anda untuk memindai QR Code kehadiran.
                </Typography>

                {mountSafe && typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost' && (
                  <Alert severity="warning" icon={<SecurityIcon />} sx={{ mb: 3, borderRadius: 2 }}>
                    Akses kamera memerlukan HTTPS.
                  </Alert>
                )}

                <Button
                  variant="contained"
                  disabled={loading}
                  size="large"
                  onClick={startScanner}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CameraswitchIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  Mulai Pindai QR
                </Button>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              >
                <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', bgcolor: 'black' }}>
                  <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  {/* Scanning Overlay Animation */}
                  <Box
                    component={motion.div}
                    animate={{ top: ['20%', '80%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '240px',
                      height: 4,
                      background: 'linear-gradient(90deg, transparent, #ec4899, transparent)',
                      boxShadow: '0 0 20px #ec4899',
                      zIndex: 10,
                      top: '50%',
                      borderRadius: 2
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '260px',
                    height: '260px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: 4,
                    boxShadow: '0 0 0 1000px rgba(0, 0, 0, 0.6)'
                  }}>
                    {/* Corner Markers */}
                    {[0, 1, 2, 3].map(i => (
                      <Box
                        key={i}
                        sx={{
                          position: 'absolute',
                          width: 40,
                          height: 40,
                          borderColor: 'white',
                          borderStyle: 'solid',
                          borderWidth: '4px',
                          top: i < 2 ? -2 : undefined,
                          bottom: i >= 2 ? -2 : undefined,
                          left: i % 2 === 0 ? -2 : undefined,
                          right: i % 2 !== 0 ? -2 : undefined,
                          borderRight: i % 2 === 0 ? 'none' : undefined,
                          borderLeft: i % 2 !== 0 ? 'none' : undefined,
                          borderBottom: i < 2 ? 'none' : undefined,
                          borderTop: i >= 2 ? 'none' : undefined,
                          borderTopLeftRadius: i === 0 ? 12 : 0,
                          borderTopRightRadius: i === 1 ? 12 : 0,
                          borderBottomLeftRadius: i === 2 ? 12 : 0,
                          borderBottomRightRadius: i === 3 ? 12 : 0,
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 40,
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 4
                    }}
                  >
                    Arahkan kamera ke QR Code
                  </Typography>
                </Box>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 40, textAlign: 'center' }}>
                <CircularProgress size={80} thickness={4} />
                <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>Memverifikasi Data...</Typography>
              </motion.div>
            )}

            {scanResult && (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ padding: 40, textAlign: 'center', width: '100%' }}>
                <Box sx={{ color: theme.palette.success.main, mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 100 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
                  Absensi Berhasil!
                </Typography>
                <Alert
                  severity="success"
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    textAlign: 'left',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  {scanResult}
                </Alert>
                <Button variant="contained" onClick={startScanner} size="large" fullWidth sx={{ borderRadius: 3 }}>
                  Pindai Lagi
                </Button>
              </motion.div>
            )}

            {error && (
              <motion.div key="error" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ padding: 40, textAlign: 'center', width: '100%' }}>
                <Box sx={{ color: theme.palette.error.main, mb: 2 }}>
                  <ErrorIcon sx={{ fontSize: 100 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="error.main">
                  Gagal Absen
                </Typography>
                <Alert
                  severity="error"
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    textAlign: 'left',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  {error}
                </Alert>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" color="error" onClick={() => setError(null)} fullWidth sx={{ borderRadius: 3 }}>
                    Kembali
                  </Button>
                  <Button variant="contained" color="error" onClick={startScanner} fullWidth sx={{ borderRadius: 3 }}>
                    Coba Lagi
                  </Button>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>

        <AnimatePresence>
          {isScanning && (
            <Fab
              component={motion.button}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              color="secondary"
              aria-label="stop"
              onClick={stopScanner}
              sx={{
                mt: -3,
                position: 'relative',
                zIndex: 10,
                width: 70,
                height: 70,
                boxShadow: '0 8px 20px rgba(236, 72, 153, 0.4)'
              }}
            >
              <StopIcon fontSize="large" />
            </Fab>
          )}
        </AnimatePresence>
      </Container>
    </Layout>
  );
};

export default AbsensiScanner;
