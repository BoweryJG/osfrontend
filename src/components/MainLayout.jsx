import React from 'react';
import { Box } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '2rem',
        gap: '2rem',
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
};

export default MainLayout;
