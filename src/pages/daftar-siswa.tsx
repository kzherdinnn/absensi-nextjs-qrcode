import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  Pagination,
  useTheme,
  Grid,
  Stack,
  CircularProgress
} from '@mui/material';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { semuaSiswa } from '@/services/siswaApi';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  nama: string;
  email: string;
  peran: string;
  avatar?: string;
}

function DaftarSiswa() {
  const [dataSiswa, setDataSiswa] = useState<UserProfile[]>([]);
  const [filteredData, setFilteredData] = useState<UserProfile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const data = useSelector((state: any) => state.data.data);
  const router = useRouter();
  const theme = useTheme();

  const ambilData = useCallback(async () => {
    setLoading(true);
    try {
      const respon = await semuaSiswa(1);
      if (respon?.data) {
        setDataSiswa(respon.data);
        setFilteredData(respon.data);
        setTotalPages(respon.totalHalaman || 1);
      }
    } catch (error) {
      console.error('Gagal mengambil data Siswa:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!data || !data.nama) {
      router.push('/login');
    } else {
      ambilData();
    }
  }, [data, router, ambilData]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (Array.isArray(dataSiswa)) {
      const filtered = dataSiswa.filter(item =>
        item.nama.toLowerCase().includes(lowerCaseQuery) ||
        item.email.toLowerCase().includes(lowerCaseQuery) ||
        item.peran.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, dataSiswa]);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const statCards = [
    {
      label: 'Total Siswa',
      value: dataSiswa.length,
      icon: <PeopleIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: '#fff'
    },
    {
      label: 'Administrator',
      value: dataSiswa.filter(u => u.peran === 'admin').length,
      icon: <VerifiedUserIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      color: '#fff'
    },
    {
      label: 'Siswa',
      value: dataSiswa.filter(u => u.peran === 'Siswa').length,
      icon: <AccountCircleIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff'
    },
  ];

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Daftar Siswa
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manajemen data seluruh siswa dan administrator
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => router.push('/registrasi-siswa')}
            sx={{
              borderRadius: 2,
              padding: '12px 28px',
              background: theme.palette.primary.main,
              boxShadow: theme.shadows[4],
              '&:hover': {
                background: theme.palette.primary.dark,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s'
            }}
          >
            Tambah Siswa
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'white',
                    boxShadow: theme.shadows[2],
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: 8,
                    height: '100%',
                    background: stat.gradient
                  }} />

                  <Box sx={{
                    p: 2,
                    borderRadius: 3,
                    background: stat.gradient,
                    color: stat.color,
                    mr: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" color="text.primary">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={0}
          sx={{
            p: 1,
            mb: 4,
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            boxShadow: theme.shadows[1]
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Cari Siswa berdasarkan nama, email, atau peran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" sx={{ ml: 1, mr: 1, fontSize: 28 }} />
                </InputAdornment>
              ),
              style: { fontSize: '1.1rem', padding: '8px' }
            }}
          />
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', boxShadow: theme.shadows[3] }}>
          <Table>
            <TableHead sx={{ background: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2 }}>Siswa</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2 }}>PERAN</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 2, textAlign: 'center' }}>AKSI</TableCell>
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
                ) : filteredData.length > 0 ? (
                  filteredData.map((Siswa, index) => (
                    <TableRow
                      key={Siswa.email}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                              bgcolor: Siswa.peran === 'admin' ? theme.palette.secondary.main : theme.palette.primary.main,
                              width: 45,
                              height: 45,
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {Siswa.nama ? Siswa.nama[0] : '?'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">{Siswa.nama}</Typography>
                            <Typography variant="body2" color="text.secondary">{Siswa.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={Siswa.peran === 'admin' ? <SettingsIcon fontSize='small' color='inherit' /> : <AccountCircleIcon fontSize='small' color='inherit' />}
                          label={Siswa.peran === 'admin' ? 'Administrator' : 'Siswa'}
                          size="small"
                          sx={{
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            bgcolor: Siswa.peran === 'admin' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                            color: Siswa.peran === 'admin' ? theme.palette.secondary.main : theme.palette.primary.main,
                            border: '1px solid',
                            borderColor: Siswa.peran === 'admin' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(99, 102, 241, 0.3)',
                            py: 0.5,
                            height: 28
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Aktif"
                          size="small"
                          sx={{
                            height: 24,
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            sx={{ color: theme.palette.info.main, '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' } }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton
                            size="small"
                            sx={{ color: theme.palette.error.main, '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 60, mb: 1, color: 'text.disabled' }} />
                        <Typography color="text.secondary">Tidak ada data Siswa ditemukan</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', bgcolor: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              sx={{ '& .Mui-selected': { fontWeight: 'bold' } }}
            />
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}

export default DaftarSiswa;
