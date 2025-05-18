import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Paper } from '@mui/material';

const ModelPicker = ({ isAestheticMode }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null); // Added for selection state

  useEffect(() => {
    const fetchModels = async () => {
      console.log('ModelPicker: Initiating fetchModels...');
      try {
        // Replace with your actual backend endpoint if different
        console.log('ModelPicker: Fetching from https://osbackend-zl1h.onrender.com/api/models');
        const response = await fetch('https://osbackend-zl1h.onrender.com/api/models');
        console.log('ModelPicker: Response received, status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('ModelPicker: Data parsed from JSON:', data);
        // Add check to ensure data is an array
        if (Array.isArray(data)) {
          if (data.length > 0) {
            console.log('ModelPicker: First model object:', JSON.stringify(data[0], null, 2));
          }
          setModels(data); // Assuming the data is an array of model objects

          // Attempt to set default model (e.g., GPT-3.5 Turbo)
          const defaultModel = data.find(
            (m) => (m.id && m.id.toLowerCase().includes('gpt-3.5-turbo')) || 
                   (m.name && m.name.toLowerCase().includes('gpt-3.5-turbo'))
          );
          if (defaultModel) {
            setSelectedModelId(defaultModel.id);
          } else if (data.length > 0) {
            // setSelectedModelId(data[0].id); // Fallback to first model if desired, or leave null
            console.log('Default model GPT-3.5 Turbo not found.');
          }
        } else {
          console.error('Expected an array of models, but received:', data);
          throw new Error('Invalid data format received from server.');
        }
      } catch (e) {
        console.error('ModelPicker: Error in fetchModels:', e);
        setError(e.message);
        console.error('Failed to fetch models:', e); // Kept original log too for consistency
      }
      setLoading(false);
    };

    fetchModels();
  }, []);

  const handleSelectModel = (modelId) => {
    setSelectedModelId(modelId);
    // console.log('Selected model ID:', modelId); // Optional: for debugging selection
  };

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

  // Helper to format context length (e.g., 200k)
  const formatContextLength = (length) => {
    if (!length) return 'N/A';
    if (length >= 1000) return `${length / 1000}k`;
    return length.toString();
  };

  if (models.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2, bgcolor: isAestheticMode ? 'rgba(255,255,255,0.05)' : '', color: isAestheticMode ? '#ccc': '' }}>
        No models available at the moment.
      </Alert>
    );
  }

  const selectedModelDetails = models.find(m => m.id === selectedModelId);

  // Render function for the compact model list items
  const renderCompactModelItem = (model) => {
    const isSelected = model.id === selectedModelId;
    const primaryTextColor = isAestheticMode ? (isSelected ? '#fff' : '#eee') : (isSelected ? 'primary.main' : 'text.primary');
    const itemBgColor = isAestheticMode ? (isSelected ? 'rgba(255,255,255,0.15)' : 'transparent') : (isSelected ? 'action.selected' : 'transparent');

    return (
      <ListItem
        key={model.id}
        button
        selected={isSelected}
        onClick={() => handleSelectModel(model.id)}
        sx={{
          bgcolor: itemBgColor,
          '&:hover': {
            bgcolor: isAestheticMode ? 'rgba(255,255,255,0.1)' : 'action.hover',
          },
          borderBottom: isAestheticMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
          py: 1, // Compact padding
        }}
      >
        <ListItemText
          primaryTypographyProps={{
            variant: "subtitle2", // Make text a bit smaller for compact list
            sx: { color: primaryTextColor, fontWeight: isSelected ? 'bold' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
          }}
          primary={model.name || model.id}
        />
        {model.pricing === 'paid' && (
          <Typography variant="caption" sx={{ color: isAestheticMode ? 'warning.light' : 'warning.main', ml: 1, fontWeight: 'bold' }}>
            $
          </Typography>
        )}
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: { xs: 'auto', md: 'calc(100vh - 220px)' }, maxHeight: '70vh', flexDirection: { xs: 'column', md: 'row' }, p: isAestheticMode ? 1 : 2, gap: isAestheticMode ? 1 : 2, bgcolor: isAestheticMode ? '#1e1e1e' : 'background.default' }}>
      {/* Scrollable Model List */}
      <Paper elevation={isAestheticMode ? 0 : 3} sx={{ width: { xs: '100%', md: '320px' }, overflowY: 'auto', flexShrink: 0, border: isAestheticMode ? '1px solid rgba(255,255,255,0.2)' : '', bgcolor: isAestheticMode ? 'rgba(0,0,0,0.2)' : 'background.paper' }}>
        <List dense disablePadding>
          {models.map((model) => renderCompactModelItem(model))}
        </List>
      </Paper>

      {/* Selected Model Details Panel */}
      <Paper elevation={isAestheticMode ? 0 : 3} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', border: isAestheticMode ? '1px solid rgba(255,255,255,0.2)' : '', bgcolor: isAestheticMode ? 'rgba(0,0,0,0.2)' : 'background.paper' }}>
        {selectedModelDetails ? (
          <Box sx={{ color: isAestheticMode ? '#eee' : 'text.primary' }}>
            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
              {selectedModelDetails.name}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom sx={{ color: isAestheticMode ? '#aaa' : 'text.secondary' }}>
              ID: {selectedModelDetails.id}
            </Typography>
            <Typography variant="body2" paragraph sx={{ mt: 1, color: isAestheticMode ? '#ddd' : 'text.secondary', whiteSpace: 'pre-wrap' }}>
              {selectedModelDetails.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ color: isAestheticMode ? '#ccc' : 'text.secondary' }}>
                <strong>Pricing:</strong> {selectedModelDetails.pricing === 'paid' ? 'Paid' : 'Free'}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: isAestheticMode ? '#ccc' : 'text.secondary', mt: 0.5 }}>
                <strong>Context Length:</strong> {formatContextLength(selectedModelDetails.context_length)}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: isAestheticMode ? '#ccc' : 'text.secondary', mt: 0.5 }}>
                <strong>Architecture:</strong> {selectedModelDetails.architecture || 'N/A'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ color: isAestheticMode ? '#777' : 'text.secondary' }}>Select a model from the list to see details.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
  // End of ModelPicker component function body.
  // Old rendering logic removed.
};

export default ModelPicker;
