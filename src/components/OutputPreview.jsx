import React, { useState } from 'react';
import { Box, Typography, Button, Menu, MenuItem, Divider, Paper, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SaveIcon from '@mui/icons-material/Save';
import GetAppIcon from '@mui/icons-material/GetApp';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

const OutputPreview = ({ sections = {}, isAestheticMode = false }) => {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const exportOpen = Boolean(exportAnchorEl);

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleSaveDialogOpen = () => {
    setSaveDialogOpen(true);
    handleExportClose();
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
  };

  const handleEmailDialogOpen = () => {
    setEmailDialogOpen(true);
    handleExportClose();
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
  };

  const handleEmailSubmit = () => {
    // In a real app, this would call an API endpoint to send the email
    alert(`Report would be sent to ${emailAddress} (backend implementation needed)`);
    setEmailDialogOpen(false);
    setEmailAddress('');
  };

  // Save as plain text
  const saveAsText = () => {
    const content = Object.entries(sections)
      .map(([key, text]) => {
        let title = key;
        if (key === 'marketAnalysis') title = 'Market Analysis';
        if (key === 'industryOverview') title = 'Industry Overview';
        if (key === 'competitiveLandscape') title = 'Competitive Landscape';
        return `${title}\n\n${text}\n\n`;
      })
      .join('\n---\n\n');
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report-${new Date().toISOString().substring(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save as HTML
  const saveAsHTML = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Doctor Report</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .section { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>Doctor-Ready Report</h1>
    `;

    Object.entries(sections).forEach(([key, text]) => {
      let title = key;
      if (key === 'marketAnalysis') title = 'Market Analysis';
      if (key === 'industryOverview') title = 'Industry Overview';
      if (key === 'competitiveLandscape') title = 'Competitive Landscape';
      
      htmlContent += `
        <div class="section">
          <h2>${title}</h2>
          <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    });

    htmlContent += `
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `report-${new Date().toISOString().substring(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportOptions = [
    { id: 'save', label: 'Save Report', icon: <SaveIcon fontSize="small" /> },
    { id: 'email', label: 'Email Report', icon: <EmailIcon fontSize="small" /> },
    { id: 'sphere', label: 'Send to Sphere OS', icon: null },
    { id: 'hubspot', label: 'Send to HubSpot', icon: null },
    { id: 'salesforce', label: 'Send to Salesforce', icon: null },
    { id: 'doctor', label: 'Send to Doctor', icon: null },
    { id: 'coworker', label: 'Send to CoWorker', icon: null },
  ];

  const handleExportOptionSelect = (option) => {
    switch(option) {
      case 'save':
        handleSaveDialogOpen();
        break;
      case 'email':
        handleEmailDialogOpen();
        break;
      default:
        alert(`Option "${option}" would be implemented in a production environment`);
        handleExportClose();
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      flexBasis: { xs: '100%', md: '50%' }, // Full width on mobile, 50% on desktop
      minWidth: { xs: '100%', md: '350px' }, // Full width on mobile
      mt: { xs: 2, md: 0 } // Add margin on top for mobile
    }}>
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
            sx={{
              '& .MuiMenu-paper': {
                backgroundColor: isAestheticMode
                  ? 'rgba(30, 30, 45, 0.9)'
                  : 'background.paper',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                border: isAestheticMode
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : 'none',
              },
            }}
          >
            {exportOptions.map((option) => (
              <MenuItem
                key={option.id}
                onClick={() => handleExportOptionSelect(option.id)}
                sx={{
                  color: isAestheticMode ? '#fff' : 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {option.icon && <Box sx={{ width: 24, display: 'flex', alignItems: 'center' }}>{option.icon}</Box>}
                {option.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Save Report Dialog */}
          <Dialog
            open={saveDialogOpen}
            onClose={handleSaveDialogClose}
            PaperProps={{
              sx: {
                backgroundColor: isAestheticMode ? 'rgba(30, 30, 45, 0.95)' : 'background.paper',
                backdropFilter: 'blur(10px)',
                border: isAestheticMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                borderRadius: '12px',
                padding: 2,
                minWidth: '300px'
              }
            }}
          >
            <DialogTitle sx={{ color: isAestheticMode ? 'white' : 'text.primary' }}>
              Save Report
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<GetAppIcon />}
                  onClick={saveAsText}
                  sx={{ 
                    color: isAestheticMode ? 'white' : 'primary.main',
                    borderColor: isAestheticMode ? 'rgba(255, 255, 255, 0.3)' : 'primary.main'
                  }}
                >
                  Save as Text (.txt)
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                  onClick={saveAsHTML}
                  sx={{ 
                    color: isAestheticMode ? 'white' : 'primary.main',
                    borderColor: isAestheticMode ? 'rgba(255, 255, 255, 0.3)' : 'primary.main'
                  }}
                >
                  Save as HTML (.html)
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={() => {
                    alert('PDF export would require a PDF generation library');
                    handleSaveDialogClose();
                  }}
                  sx={{ 
                    color: isAestheticMode ? 'white' : 'primary.main',
                    borderColor: isAestheticMode ? 'rgba(255, 255, 255, 0.3)' : 'primary.main'
                  }}
                >
                  Save as PDF (.pdf)
                </Button>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Email Report Dialog */}
          <Dialog
            open={emailDialogOpen}
            onClose={handleEmailDialogClose}
            PaperProps={{
              sx: {
                backgroundColor: isAestheticMode ? 'rgba(30, 30, 45, 0.95)' : 'background.paper',
                backdropFilter: 'blur(10px)',
                border: isAestheticMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                borderRadius: '12px',
                padding: 2,
                minWidth: '300px'
              }
            }}
          >
            <DialogTitle sx={{ color: isAestheticMode ? 'white' : 'text.primary' }}>
              Email Report
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  InputLabelProps={{
                    style: { color: isAestheticMode ? 'rgba(255, 255, 255, 0.7)' : undefined }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isAestheticMode ? 'rgba(255, 255, 255, 0.2)' : undefined,
                      },
                      '&:hover fieldset': {
                        borderColor: isAestheticMode ? 'rgba(255, 255, 255, 0.3)' : undefined,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : undefined,
                      },
                      color: isAestheticMode ? 'white' : undefined
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleEmailSubmit}
                  disabled={!emailAddress || !emailAddress.includes('@')}
                  sx={{ 
                    mt: 2,
                    backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
                  }}
                >
                  Send Email
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
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
            flex: { md: 1 },
            minWidth: { md: 0 },
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
            flex: { md: 1 },
            minWidth: { md: 0 },
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
            flex: { md: 1 },
            minWidth: { md: 0 },
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
          onClick={() => {
            alert('Custom brief for doctor created successfully!');
          }}
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
