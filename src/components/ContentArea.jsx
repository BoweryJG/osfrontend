import React from 'react';
import { Box } from '@mui/material';

const ContentArea = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0, // Ensures the box can shrink below its content size
        maxWidth: '60%',
        overflow: 'auto',
        borderRadius: '16px',
        height: 'calc(100vh - 140px)',
      }}
    >
      {children}
    </Box>
  );
};

export default ContentArea;
