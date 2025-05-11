import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const Sidebar = ({ selectedOption, onOptionSelect }) => {
  const menuItems = [
    {
      id: 'pickModel',
      label: 'Pick Model',
      icon: <SmartToyOutlinedIcon />,
    },
    {
      id: 'selectPrompt',
      label: 'Select Prompt',
      icon: <SmartToyOutlinedIcon />,
    },
    {
      id: 'marketIntel',
      label: 'Market Intel',
      icon: <InsightsOutlinedIcon />,
    },
    {
      id: 'salesStrategies',
      label: 'Sales Strategies',
      icon: <SellOutlinedIcon />,
    },
    {
      id: 'doctorReport',
      label: 'Doctor-Ready Report',
      icon: <ArticleOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        backgroundColor: 'rgba(15, 15, 25, 0.6)',
        borderRadius: '16px',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
    >
      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedOption === item.id}
              onClick={() => onOptionSelect(item.id)}
              sx={{
                py: 1.5,
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(138, 116, 249, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(138, 116, 249, 0.15)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selectedOption === item.id ? 'primary.main' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selectedOption === item.id ? 600 : 400,
                  color: selectedOption === item.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          p: 2,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.75rem',
        }}
      >
        <Box
          component="img"
          src="/logo-small.png"
          alt="repSpheres Logo"
          sx={{
            width: 24,
            height: 24,
            opacity: 0.5,
            mb: 1,
          }}
        />
        <Box>© 2025 repSpheres</Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
