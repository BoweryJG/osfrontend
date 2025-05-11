import React, { useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem, Divider, Paper } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const OutputPreview = ({ sections = [], isAestheticMode = false }) => {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportOpen = Boolean(exportAnchorEl);

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const exportOptions = [
    { id: 'cloud', label: 'Send to Cloud' },
    { id: 'social', label: 'Save to Social Device' },
    { id: 'sphere', label: 'Send to Sphere OS' },
    { id: 'hubspot', label: 'Send to HubSpot' },
    { id: 'salesforce', label: 'Send to Salesforce' },
    { id: 'self', label: 'Send to Yourself' },
    { id: 'doctor', label: 'Send to Doctor' },
    { id: 'coworker', label: 'Send to CoWorker' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'white',
            fontSize: '1.75rem',
          }}
        >
          Output Preview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'rgba(30, 30, 40, 0.6)',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(30, 30, 40, 0.8)',
              },
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleExportClick}
            sx={{
              backgroundColor: 'rgba(30, 30, 40, 0.6)',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(30, 30, 40, 0.8)',
              },
            }}
          >
            Send to Doc
          </Button>
          <Menu
            anchorEl={exportAnchorEl}
            open={exportOpen}
            onClose={handleExportClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                backgroundColor: 'rgba(30, 30, 40, 0.95)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                color: 'white',
                minWidth: '200px',
              },
            }}
          >
            {exportOptions.map((option) => (
              <MenuItem
                key={option.id}
                onClick={handleExportClose}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(138, 116, 249, 0.1)',
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Market Analysis Section */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: isAestheticMode
              ? 'rgba(138, 116, 249, 0.1)'
              : 'rgba(20, 20, 35, 0.6)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'white',
            }}
          >
            Market Analysis
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {sections.marketAnalysis ||
              'Complete the Market Intel form to generate market analysis content.'}
          </Typography>
        </Paper>

        {/* Industry Overview Section */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: isAestheticMode
              ? 'rgba(138, 116, 249, 0.1)'
              : 'rgba(20, 20, 35, 0.6)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'white',
            }}
          >
            Industry Overview
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {sections.industryOverview ||
              'Complete the Market Intel form to generate industry overview content.'}
          </Typography>
        </Paper>

        {/* Competitive Landscape Section */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: isAestheticMode
              ? 'rgba(138, 116, 249, 0.1)'
              : 'rgba(20, 20, 35, 0.6)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'white',
            }}
          >
            Competitive Landscape
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {sections.competitiveLandscape ||
              'Complete the Market Intel form to generate competitive landscape content.'}
          </Typography>
        </Paper>
      </Box>

      {/* Create Custom Brief Button */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'rgba(138, 116, 249, 0.2)',
            color: 'white',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 500,
            textTransform: 'none',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(138, 116, 249, 0.3)',
            },
          }}
        >
          Create Custom Brief for Doctor
        </Button>
      </Box>
    </Box>
  );
};

export default OutputPreview;
