import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Paper } from '@mui/material';

const ModelPicker = ({ isAestheticMode }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Replace with your actual backend endpoint if different
        const response = await fetch('https://osbackend-zl1h.onrender.com/api/models');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setModels(data); // Assuming the data is an array of model objects
      } catch (e) {
        setError(e.message);
        console.error('Failed to fetch models:', e);
      }
      setLoading(false);
    };

    fetchModels();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2, color: isAestheticMode ? '#ccc' : 'text.secondary' }}>Loading models...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load models: {error}
      </Alert>
    );
  }

  if (models.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No models available at the moment.
      </Alert>
    );
  }

  // Example: Distinguishing paid models. Adjust based on your actual data structure.
  // Assuming each model object has a 'tier' or 'pricing' property (e.g., model.tier === 'paid')
  const renderModelItem = (model) => {
    const isPaid = model.pricing === 'paid'; // Adjust this condition based on your model data
    return (
      <ListItem key={model.id || model.name} sx={{ 
        borderBottom: isAestheticMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
        '&:last-child': {
            borderBottom: 'none'
        }
      }}>
        <ListItemText 
          primary={model.name}
          secondary={model.description || 'No description available'}
          primaryTypographyProps={{ 
            fontWeight: isPaid ? 'bold' : 'normal', 
            color: isAestheticMode ? (isPaid ? 'primary.main' : '#fff') : (isPaid ? 'primary.main' : 'text.primary') 
          }}
          secondaryTypographyProps={{ color: isAestheticMode ? '#bbb' : 'text.secondary' }}
        />
        {isPaid && (
          <Typography variant="caption" sx={{ 
            ml: 2, 
            p: '2px 8px',
            borderRadius: '4px',
            backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.2)' : 'primary.light',
            color: isAestheticMode ? 'primary.main' : 'primary.contrastText'
            }}>PAID</Typography>
        )}
      </ListItem>
    );
  };

  return (
    <Paper elevation={isAestheticMode ? 0 : 3} sx={{
      padding: isAestheticMode ? 0 : '1rem 2rem',
      backgroundColor: isAestheticMode ? 'transparent' : 'background.paper',
      border: isAestheticMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
      borderRadius: isAestheticMode ? '8px' : '4px',
      height: 'calc(100vh - 200px)', // Adjust as needed based on your layout
      overflowY: 'auto',
    }}>
      <Typography variant="h5" sx={{ color: isAestheticMode ? '#fff' : 'text.primary', mb: 2, textAlign: isAestheticMode ? 'left' : 'center' }}>
        Available AI Models
      </Typography>
      <List>
        {models.map(renderModelItem)}
      </List>
    </Paper>
  );
};

export default ModelPicker;
