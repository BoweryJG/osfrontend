import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ isAestheticMode, toggleAestheticMode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(10, 10, 20, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 700,
            color: 'white',
            mr: 6,
          }}
        >
          repSpheres
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = '/'}
          sx={{
            mr: 2,
            backgroundColor: 'rgba(30, 30, 40, 0.6)',
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: 'rgba(30, 30, 40, 0.8)',
            },
          }}
        >
          Back to Home
        </Button>

        <Button
          variant="contained"
          startIcon={isAestheticMode ? <Brightness7Icon /> : <Brightness4Icon />}
          onClick={toggleAestheticMode}
          sx={{
            backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.2)' : 'rgba(30, 30, 40, 0.6)',
            color: 'white',
            textTransform: 'none',
            borderRadius: '20px',
            px: 2,
            '&:hover': {
              backgroundColor: isAestheticMode
                ? 'rgba(138, 116, 249, 0.3)'
                : 'rgba(30, 30, 40, 0.8)',
            },
          }}
        >
          Aesthetic
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
