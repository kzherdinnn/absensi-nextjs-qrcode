import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Pagination,
  Chip,
  Avatar,
  useTheme,
  CircularProgress,
  Stack,
  Tooltip
} from '@mui/material';
import Layout from '@/components/Layout';
import { semuaKehadiran } from '@/services/kehadiranApi';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ubahTanggal } from '@/services/utils';
import { WS_BASE_URL } from '@/services/configService';
import { motion, AnimatePresence } from 'framer-motion';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OutputIcon from '@mui/icons-material/Output';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import EventBusyIcon from '@mui/icons-material/EventBusy';

interface Siswa {
  _id: string;
  nama: string;
  avatar?: string;
}
interface Kehadiran {
  _id: string;
  Siswa: Siswa;
  datang: string;
  pulang: string;
}

const DaftarKehadiran: React.FC = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataKehadiran, setDataKehadiran] = useState<Kehadiran[]>([]);
  const [loading, setLoading] = useState(true);

  const data = useSelector((state: any) => state.data.data);
  const router = useRouter();
  const theme = useTheme();

  const ambilData = useCallback(async () => {
    setLoading(true);
    try {
      const respon = await semuaKehadiran(page);
      if (respon?.kehadiran) {
        setDataKehadiran(respon.kehadiran);
        setTotalPages(respon.halamanInfo?.totalHalaman || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!data || !data.nama) {
      router.push('/login');
    } else {
      ambilData();
    }
  }, [data, router, ambilData]);

  useEffect(() => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(WS_BASE_URL);

      ws.addEventListener('open', () => {
        console.log('Connected to WS');
      });

      ws.addEventListener('message', (event) => {
        // Refresh data on new attendance
        ambilData();
      });

    } catch (e) {
      console.error("WS connection failed", e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [ambilData]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Riwayat Kehadiran
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Pantau aktivitas absen masuk dan pulang Siswa secara real-time
            </Typography>
          </Box>
          <Chip
            icon={<WifiTetheringIcon sx={{ animation: 'pulse 2s infinite' }} />}
            label="Live Updates Active"
            color="error"
            variant="outlined"
            sx={{
              fontWeight: 'bold',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              bgcolor: 'rgba(239, 68, 68, 0.05)',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.6 },
                '100%': { opacity: 1 },
              }
            }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: theme.shadows[3],
            background: 'white'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2 }}>Siswa</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2 }}>WAKTU DATANG</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2 }}>WAKTU PULANG</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2, textAlign: 'center' }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence mode='wait'>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : dataKehadiran.length > 0 ? (
                    dataKehadiran.map((kehadiran, index) => (
                      <TableRow
                        key={kehadiran._id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        hover
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s',
                          '&:hover': { backgroundColor: '#fdfbff !important' }
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.primary.light,
                                width: 45,
                                height: 45,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                              }}
                            >
                              {kehadiran.Siswa?.nama ? kehadiran.Siswa.nama[0] : '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                {kehadiran.Siswa?.nama || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {kehadiran.Siswa?._id.substring(0, 8)}...
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex' }}>
                              <LoginIcon fontSize='small' />
                            </Box>
                            <Typography variant="body2" fontWeight={500}>
                              {ubahTanggal(kehadiran.datang)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {kehadiran.pulang ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex' }}>
                                <LogoutIcon fontSize='small' />
                              </Box>
                              <Typography variant="body2" fontWeight={500}>
                                {ubahTanggal(kehadiran.pulang)}
                              </Typography>
                            </Stack>
                          ) : (
                            <Chip
                              icon={<AccessTimeIcon />}
                              label="Belum Pulang"
                              size="small"
                              variant="outlined"
                              color="warning"
                              sx={{ borderRadius: 2 }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={kehadiran.pulang ? "Selesai" : "Hadir"}
                            size="small"
                            sx={{
                              fontWeight: 'bold',
                              borderRadius: 2,
                              px: 1,
                              bgcolor: kehadiran.pulang ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: kehadiran.pulang ? '#10b981' : '#3b82f6',
                              border: '1px solid',
                              borderColor: kehadiran.pulang ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={2} sx={{ opacity: 0.6 }}>
                          <EventBusyIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                          <Typography color="text.secondary">Belum ada data kehadiran hari ini</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default DaftarKehadiran;
