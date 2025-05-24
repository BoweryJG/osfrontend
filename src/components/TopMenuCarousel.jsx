import React from 'react';
import { Tabs, Tab, Box, useTheme, useMediaQuery } from '@mui/material';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';

const menuItems = [
  { id: 'marketIntel', label: 'Prospect Intelligence', icon: <InsightsOutlinedIcon /> },
  { id: 'selectPrompt', label: 'Select Prompt', icon: <AutoAwesomeIcon /> },
  { id: 'pickModel', label: 'Pick Model', icon: <ModelTrainingIcon /> },
  { id: 'salesStrategies', label: 'Sales Strategies', icon: <SellOutlinedIcon /> },
  { id: 'doctorReport', label: 'Doctor-Ready Report', icon: <ArticleOutlinedIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
];

const TopMenuCarousel = ({ selectedOption, onOptionSelect }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={selectedOption}
        onChange={(e, newValue) => onOptionSelect(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        textColor="inherit"
        indicatorColor="primary"
      >
        {menuItems.map((item) => (
          <Tab
            key={item.id}
            value={item.id}
            icon={item.icon}
            label={isSmall ? undefined : item.label}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TopMenuCarousel;
