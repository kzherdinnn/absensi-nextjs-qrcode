import React, { ReactNode } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface ContentProps {
  children: ReactNode;
}
const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 0, // Padding handled by pages or Layout
        width: '100%',
        position: 'relative'
      }}
    >
      {children}
    </Box>
  );
};

export default Content;
