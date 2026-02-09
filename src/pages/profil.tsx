import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { statistikKehadiran, aktivitasTerbaru } from '@/services/kehadiranApi';
import { semuaSiswa, updateSiswa } from '@/services/siswaApi';
import { ubahTanggal } from '@/services/utils';
import EditIcon from '@mui/icons-material/Edit';

// Interfaces based on API usage
interface Siswa {
  _id: string;
  nama: string;
  avatar?: string;
}
interface Aktivitas {
  _id: string;
  Siswa: Siswa;
  waktu: string;
  jenis: 'datang' | 'pulang';
}

interface UserProfile {
  _id: string;
  nama: string;
  email: string;
  peran: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Aktivitas[]>([]);
  const [todayStats, setTodayStats] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [datangStats, setDatangStats] = useState<number[]>([]);
  const [pulangStats, setPulangStats] = useState<number[]>([]);
  const [statsLabels, setStatsLabels] = useState<string[]>(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']);
  const [periode, setPeriode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setEditLoading(true);
    try {
      await updateSiswa(user._id, editForm.nama, editForm.email, editForm.password || undefined);
      setOpenEdit(false);
      alert('Profil berhasil diperbarui. Silakan login kembali untuk melihat perubahan.');
      router.push('/login');
    } catch (e) {
      console.error(e);
      alert('Gagal update profil');
    } finally {
      setEditLoading(false);
    }
  };

  const data = useSelector((state: any) => state.data.data);
  const router = useRouter();
  const theme = useTheme();

  // Load User Data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!data || !data.nama) {
        router.push('/login');
        return;
      }
      setUser(data);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [data, router]);

  // Load Recent Activity
  useEffect(() => {
    const fetchRecent = async () => {
      if (!user) return;

      try {
        // Gunakan API baru untuk aktivitas terbaru
        const res = await aktivitasTerbaru(20);
        if (res?.data) {
          setRecentActivity(res.data);

          // Calculate today's stats
          const todayStr = new Date().toDateString();
          const count = res.data.filter((k: any) =>
            new Date(k.waktu).toDateString() === todayStr
          ).length;
          setTodayStats(count);

          // Fetch Total Siswa (Real Data) - Only Admin
          if (user.peran === 'admin') {
            try {
              const resSiswa = await semuaSiswa(1);
              if (resSiswa?.data) {
                const total = resSiswa.totalData || resSiswa.totalDocs || resSiswa.total || resSiswa.data.length;
                setTotalSiswa(total);
              }
            } catch (e) {
              console.error("Failed to fetch total Siswa", e);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load recent activity", err);
      }
    };

    if (user) {
      fetchRecent();
    }
  }, [user]);

  // Load Statistics based on periode
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const resStats = await statistikKehadiran(periode);
        if (resStats?.data && Array.isArray(resStats.data)) {
          setWeeklyStats(resStats.data);
          setDatangStats(resStats.datang || []);
          setPulangStats(resStats.pulang || []);
          setStatsLabels(resStats.labels || []);
        }
      } catch (e) {
        console.error("Failed to fetch statistics", e);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, periode]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) return null;

  const isAdmin = user.peran === 'admin';

  // Stats Data (Real Data Only)
  const lastUpdate = recentActivity.length > 0
    ? new Date(recentActivity[0].waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '--';

  const stats = [
    { label: 'Aktivitas Hari Ini', value: todayStats.toString(), icon: <CheckCircleIcon />, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Terakhir Update', value: lastUpdate, icon: <AccessTimeIcon />, color: '#3b82f6', bg: '#eff6ff' },
  ];

  if (isAdmin) {
    stats.splice(1, 0, { label: 'Total Siswa', value: totalSiswa.toString(), icon: <PersonIcon />, color: '#f59e0b', bg: '#fffbeb' });
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Prepare Data for Recharts
  const chartData = statsLabels.map((label, index) => ({
    name: label,
    datang: datangStats[index] || 0,
    pulang: pulangStats[index] || 0,
    total: (datangStats[index] || 0) + (pulangStats[index] || 0)
  }));


  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Header */}
          <Paper
            elevation={0}
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: 'white',
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid rgba(255,255,255,0.3)',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {user.nama[0].toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5, textShadow: '0 2px 4px rgba(0,0,0,0.1)', textTransform: 'capitalize' }}>
                        Halo, {user.nama.includes('@') ? user.nama.split('@')[0] : user.nama}! 👋
                      </Typography>
                      <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        {isAdmin ? 'Panel Administrator' : 'Dashboard Siswa'}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setEditForm({ nama: user.nama, email: user.email, password: '' });
                        setOpenEdit(true);
                      }}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Edit Profil
                    </Button>
                  </Box>

                  <Box sx={{ mt: 2, display: 'inline-flex', gap: 2 }}>
                    <Chip
                      icon={<AccessTimeIcon style={{ color: 'white' }} />}
                      label={new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)', border: 'none' }}
                    />
                    <Chip
                      label={new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)', border: 'none' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Decorative Background Circles */}
            <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }} />
            <Box sx={{ position: 'absolute', bottom: -30, right: 150, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }} />
          </Paper>

          {/* Quick Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} md={stats.length === 3 ? 4 : 6} key={index}>
                <Paper
                  component={motion.div}
                  variants={itemVariants}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: theme.shadows[1],
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] }
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      color: stat.color,
                      bgcolor: stat.bg,
                      mr: 2,
                      display: 'flex'
                    }}
                  >
                    {React.cloneElement(stat.icon as React.ReactElement, { fontSize: 'medium' })}
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* New Dashboard Content: Information & Charts */}
          <Grid container spacing={3}>
            {/* Recent Activity Section */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: theme.shadows[2],
                  height: '100%'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">Aktivitas Terbaru</Typography>
                  <Chip label="Real-time" size="small" color="success" variant="outlined" />
                </Box>
                <List sx={{ p: 0 }}>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <React.Fragment key={activity._id}>
                        <ListItem button sx={{ py: 2, px: 3 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: activity.jenis === 'datang' ? theme.palette.success.light : theme.palette.error.light }}>
                              {activity.Siswa?.nama ? activity.Siswa.nama[0] : '?'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography fontWeight="600" variant="subtitle2">
                                {activity.Siswa?.nama}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                {activity.jenis === 'datang' ? (
                                  <LoginIcon sx={{ fontSize: 14, color: 'success.main' }} />
                                ) : (
                                  <LogoutIcon sx={{ fontSize: 14, color: 'error.main' }} />
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  {activity.jenis === 'datang' ? 'Datang' : 'Pulang'}: {ubahTanggal(activity.waktu)}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip
                            label={activity.jenis === 'datang' ? 'Masuk' : 'Pulang'}
                            size="small"
                            color={activity.jenis === 'datang' ? 'success' : 'error'}
                            sx={{ borderRadius: 1, fontWeight: 'bold', height: 24 }}
                          />
                        </ListItem>
                        {index < recentActivity.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">Belum ada aktivitas.</Typography>
                    </Box>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Weekly Statistics Chart */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: theme.shadows[2],
                  height: '100%',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
                }}
              >
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsertChartIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Statistik {periode === 'daily' ? 'Harian' : periode === 'weekly' ? 'Mingguan' : 'Bulanan'}
                    </Typography>
                  </Box>
                </Box>

                <ToggleButtonGroup
                  value={periode}
                  exclusive
                  onChange={(e, newPeriode) => {
                    if (newPeriode !== null) {
                      setPeriode(newPeriode);
                    }
                  }}
                  size="small"
                  sx={{ mb: 2, width: '100%' }}
                >
                  <ToggleButton value="daily" sx={{ flex: 1 }}>
                    Harian
                  </ToggleButton>
                  <ToggleButton value="weekly" sx={{ flex: 1 }}>
                    Mingguan
                  </ToggleButton>
                  <ToggleButton value="monthly" sx={{ flex: 1 }}>
                    Bulanan
                  </ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                        interval={periode === 'daily' ? 3 : periode === 'monthly' ? 4 : 0}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar
                        dataKey="datang"
                        name="Datang"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        barSize={periode === 'daily' ? 8 : 20}
                      />
                      <Bar
                        dataKey="pulang"
                        name="Pulang"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        barSize={periode === 'daily' ? 8 : 20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Total Datang</Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {datangStats.reduce((a, b) => a + b, 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Total Pulang</Typography>
                      <Typography variant="h6" fontWeight="bold" color="error.main">
                        {pulangStats.reduce((a, b) => a + b, 0)}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" align="center">
                    {weeklyStats.length > 0 && weeklyStats.some(v => v > 0) ? (
                      <>
                        <strong>{statsLabels[weeklyStats.indexOf(Math.max(...weeklyStats))]}</strong> memiliki tingkat kehadiran tertinggi.
                      </>
                    ) : (
                      'Belum ada data kehadiran.'
                    )}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

        </motion.div>
        {/* Edit Profile Dialog */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profil Saya</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="Nama Lengkap"
                fullWidth
                value={editForm.nama}
                onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              <TextField
                label="Password Baru (Kosongkan jika tidak diubah)"
                type="password"
                fullWidth
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenEdit(false)}>Batal</Button>
            <Button
              onClick={handleUpdateProfile}
              variant="contained"
              disabled={editLoading}
              sx={{ borderRadius: 2 }}
            >
              {editLoading ? <CircularProgress size={24} /> : 'Simpan Perubahan'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default DashboardPage;
