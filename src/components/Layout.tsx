import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import Sidebar from './Sidebar';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();

  const handleDrawerToggle = () => {
    if (isDesktop) {
      setCollapsed(!collapsed);
    } else {
      setMobileOpen(!mobileOpen);
    }
  };

  const sidebarWidth = collapsed ? 80 : 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={isDesktop ? collapsed : false}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%' }}>
        <Header onMenuClick={handleDrawerToggle} />

        <Box
          component={motion.main}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Main Content Area */}
          <Content>
            {children}
          </Content>

          <Box sx={{ mt: 'auto', pt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
