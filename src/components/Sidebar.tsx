import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const iconMap: { [key: string]: React.ReactElement } = {
  'Profil': <PersonIcon />,
  'Absen': <QrCodeScannerIcon />,
  'Kode Datang': <LoginIcon />,
  'Kode Pulang': <LogoutIcon />,
  'Daftar Kehadiran': <ListAltIcon />,
  'Daftar Siswa': <GroupIcon />,
  'Registrasi Siswa': <PersonAddIcon />,
  'Keluar': <ExitToAppIcon />,
  'Dashboard': <DashboardIcon />
};

const allMenuItems = [
  { text: 'Profil', href: '/profil', perans: ['admin', 'Siswa'] },
  { text: 'Absen', href: '/absen', perans: ['Siswa'] },
  { text: 'Kode Datang', href: '/kode/datang', perans: ['admin'] },
  { text: 'Kode Pulang', href: '/kode/pulang', perans: ['admin'] },
  { text: 'Daftar Kehadiran', href: '/daftar-kehadiran', perans: ['admin'] },
  { text: 'Daftar Siswa', href: '/daftar-siswa', perans: ['admin'] },
  { text: 'Registrasi Siswa', href: '/registrasi-siswa', perans: ['admin'] },
  { text: 'Keluar', href: '/login?logout=true', perans: ['admin', 'Siswa'] },
];

const Sidebar: React.FC<SidebarProps & { collapsed?: boolean }> = ({ open, onClose, collapsed = false }) => {
  const [peran, setPeran] = useState('Siswa');
  const data = useSelector((state: any) => state.data.data);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();

  useEffect(() => {
    if (data?.peran) {
      setPeran(data.peran);
    }
  }, [data]);

  const menuItems = allMenuItems.filter((item) => item.perans.includes(peran));
  const drawerWidth = collapsed ? 80 : 280;

  return (
    <Drawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={isDesktop || open} // For temporary drawer, open signals visibility. For permanent, it's always visible but we control width.
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isDesktop ? drawerWidth : 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: '#ffffff',
          width: isDesktop ? drawerWidth : 280,
          borderRight: 'none',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'start',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        height: 64
      }}>
        {collapsed ? (
          <Typography variant="h6" fontWeight="bold">A<span style={{ color: theme.palette.secondary.light }}>.A</span></Typography>
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>
            ABSENSI<span style={{ color: theme.palette.secondary.light }}>.APP</span>
          </Typography>
        )}
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = router.pathname === item.href;
          return (
            <Link href={item.href} key={`k-${index}`} passHref style={{ textDecoration: 'none' }}>
              <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
                <ListItemButton
                  selected={isActive}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    justifyContent: collapsed ? 'center' : 'initial',
                    background: isActive ? 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))' : 'transparent',
                    border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateX(4px)',
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))',
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2))',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                    transition: 'color 0.3s ease'
                  }}>
                    {iconMap[item.text] || <DashboardIcon />}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: 1 }}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.8)'
                      }}
                    />
                  )}
                  {isActive && !collapsed && (
                    <Box
                      component={motion.div}
                      layoutId="active-indicator"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: theme.palette.secondary.light,
                        ml: 1,
                        boxShadow: `0 0 8px ${theme.palette.secondary.light}`
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </Link>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2, m: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', textAlign: 'center' }}>
          Logged in as {peran}
        </Typography>
      </Box>
    </Drawer >
  );
};

export default Sidebar;
