import React, { useState } from 'react';
import { Tabs, Tab, Box, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';

const menuItems = [
  { id: 'marketIntel', label: 'Market Intel', icon: <InsightsOutlinedIcon /> },
  { id: 'selectPrompt', label: 'Select Prompt', icon: <AutoAwesomeIcon /> },
  { id: 'pickModel', label: 'Pick Model', icon: <ModelTrainingIcon /> },
  { id: 'salesStrategies', label: 'Sales Strategies', icon: <SellOutlinedIcon /> },
  { id: 'doctorReport', label: 'Doctor-Ready Report', icon: <ArticleOutlinedIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
];

const itemDescriptions = {
  marketIntel: 'Input key details about your prospect so we can research the market for you.',
  selectPrompt: 'Choose the AI prompt template best suited for your task.',
  pickModel: 'Select the AI model you would like to use for generation.',
  salesStrategies: 'Apply proven sales methodologies to your opportunity.',
  doctorReport: 'Generate the game plan report for the sales rep.',
  analytics: 'View usage analytics and reporting.',
};

const TopMenuCarousel = ({ selectedOption, onOptionSelect }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [pending, setPending] = useState(null);
  const [open, setOpen] = useState(false);

  const handleChange = (e, newValue) => {
    setPending(newValue);
    setOpen(true);
  };

  const handleConfirm = () => {
    setOpen(false);
    if (pending) {
      onOptionSelect(pending);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPending(null);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={selectedOption}
        onChange={handleChange}
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
            icon={React.cloneElement(item.icon, {
              sx: {
                color: '#8A74F9',
                transition: 'transform 0.2s',
              },
            })}
            label={isSmall ? undefined : item.label}
            iconPosition="start"
            sx={{
              minHeight: 48,
              transition: 'transform 0.2s',
              '&:hover svg': { transform: 'scale(1.2)' },
            }}
          />
        ))}
      </Tabs>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{pending && menuItems.find(m => m.id === pending)?.label}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>{pending && itemDescriptions[pending]}</Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirm}>Continue</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TopMenuCarousel;
