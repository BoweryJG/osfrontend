import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeToggle = ({ isAestheticMode, toggleAestheticMode }) => (
  <IconButton
    size="small"
    color="inherit"
    onClick={toggleAestheticMode}
    sx={{
      backgroundColor: isAestheticMode
        ? 'rgba(138,116,249,0.2)'
        : 'rgba(255,255,255,0.1)',
      '&:hover': {
        backgroundColor: isAestheticMode
          ? 'rgba(138,116,249,0.3)'
          : 'rgba(255,255,255,0.2)',
      },
    }}
  >
    {isAestheticMode ? (
      <Brightness7Icon fontSize="small" />
    ) : (
      <Brightness4Icon fontSize="small" />
    )}
  </IconButton>
);

export default ThemeToggle;
