import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';

const Sidebar = ({ selectedOption, onOptionSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const menuItems = [
    {
      id: 'marketIntel',
      label: 'Market Intel',
      icon: <InsightsOutlinedIcon />,
    },
    {
      id: 'selectPrompt',
      label: 'Select Prompt',
      icon: <AutoAwesomeIcon />, // Unique icon for prompt selection
    },
    {
      id: 'pickModel',
      label: 'Pick Model',
      icon: <ModelTrainingIcon />, // Unique icon for model selection
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
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChartIcon />,
    },
  ];

  return (
    <Box
      sx={{
        minWidth: isMobile ? '70px' : '240px', // Narrower sidebar on mobile for icon-only
        backgroundColor: 'rgba(22, 22, 30, 0.3)', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)', // For Safari support
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'min-width 0.3s ease', // Smooth transition when resizing
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
                px: isMobile ? 1.5 : 3,
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
                  minWidth: isMobile ? 36 : 40,
                  color: selectedOption === item.id ? 'primary.main' : 'rgba(255, 255, 255, 0.7)',
                  ...(isMobile && {
                    margin: '0 auto',
                    justifyContent: 'center'
                  })
                }}
              >
                {isMobile ? (
                  <Tooltip title={item.label} placement="right">
                    {item.icon}
                  </Tooltip>
                ) : item.icon}
              </ListItemIcon>
              {!isMobile && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: selectedOption === item.id ? 'primary.main' : 'white',
                      fontWeight: selectedOption === item.id ? 600 : 400,
                    },
                  }}
                />
              )}
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
