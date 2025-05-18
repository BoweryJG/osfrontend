import React from 'react';
import { Box } from '@mui/material';

const ContentArea = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        flexBasis: { xs: '100%', md: '50%' }, // Full width on mobile, 50% on desktop
        minWidth: 0, // Ensures the box can shrink below its content size
        overflow: 'auto',
        borderRadius: '16px',
        height: { xs: 'auto', md: 'calc(100vh - 140px)' }, // Auto height on mobile
        minHeight: { xs: '50vh', md: '0' }, // Minimum height on mobile
        // backgroundColor: 'rgba(0, 255, 0, 0.2)', // Debug: Light green background -- REMOVED
        // border: '2px dashed red',         // Debug: Red dashed border -- REMOVED
      }}
    >
      {children}
    </Box>
  );
};

export default ContentArea;
