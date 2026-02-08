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
  Chip
} from '@mui/material';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonIcon from '@mui/icons-material/Person';
import { semuaKehadiran } from '@/services/kehadiranApi';
import { semuaSiswa } from '@/services/SiswaApi';
import { ubahTanggal } from '@/services/utils';

// Interfaces based on API usage
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

interface UserProfile {
  nama: string;
  email: string;
  peran: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Kehadiran[]>([]);
  const [todayStats, setTodayStats] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);

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
      // Only admin can see all attendance
      if (!user || user.peran !== 'admin') {
        setRecentActivity([]);
        return;
      }

      try {
        const res = await semuaKehadiran(1);
        if (res?.kehadiran) {
          // Take top 5
          setRecentActivity(res.kehadiran.slice(0, 5));

          // Calculate today's stats from page 1 (Real Data)
          const todayStr = new Date().toDateString();
          const count = res.kehadiran.filter((k: any) =>
            new Date(k.datang).toDateString() === todayStr ||
            (k.pulang && new Date(k.pulang).toDateString() === todayStr)
          ).length;
          setTodayStats(count);

          // Fetch Total Siswa (Real Data)
          try {
            const resSiswa = await semuaSiswa(1);
            if (resSiswa?.data) {
              // Try to find total count in response, fallback to list length
              const total = resSiswa.totalData || resSiswa.totalDocs || resSiswa.total || resSiswa.data.length;
              setTotalSiswa(total);
            }
          } catch (e) {
            console.error("Failed to fetch total Siswa", e);
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
    ? new Date(recentActivity[0].pulang || recentActivity[0].datang).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
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
                  <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5, textShadow: '0 2px 4px rgba(0,0,0,0.1)', textTransform: 'capitalize' }}>
                    Halo, {user.nama.includes('@') ? user.nama.split('@')[0] : user.nama}! 👋
                  </Typography>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                    {isAdmin ? 'Administrator Panel' : 'Employee Dashboard'}
                  </Typography>

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
                            <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
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
                              <Typography variant="body2" color="text.secondary">
                                {activity.pulang ? `Pulang pada ${ubahTanggal(activity.pulang)}` : `Datang pada ${ubahTanggal(activity.datang)}`}
                              </Typography>
                            }
                          />
                          <Chip
                            label={activity.pulang ? "Pulang" : "Masuk"}
                            size="small"
                            color={activity.pulang ? "error" : "success"}
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

            {/* Weekly Statistics Chart (Mock Visual) */}
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
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertChartIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">Statistik Mingguan</Typography>
                </Box>

                <Box sx={{ height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', px: 2, pb: 2 }}>
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => {
                    const height = [40, 65, 85, 50, 90, 30, 20][i]; // Mock data percentages
                    return (
                      <Box key={day} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          style={{
                            width: '30%',
                            minWidth: 8,
                            background: i === 4 ? theme.palette.secondary.main : theme.palette.primary.light,
                            borderRadius: '4px 4px 0 0',
                            opacity: 0.8
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          {day}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(99, 102, 241, 0.05)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    <strong>Jumat</strong> memiliki tingkat kehadiran tertinggi minggu ini.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

        </motion.div>
      </Container>
    </Layout>
  );
};

export default DashboardPage;
