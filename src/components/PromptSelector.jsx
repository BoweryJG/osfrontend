import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  TextField,
  Grid,
  CircularProgress
} from '@mui/material';
import { fetchPrompts } from '../utils/supabaseClient';

const PromptSelector = ({ onSubmit, isAestheticMode = false }) => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  // Fetch prompts from Supabase
  useEffect(() => {
    const getPrompts = async () => {
      try {
        const data = await fetchPrompts();
        setPrompts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    getPrompts();
  }, []);

  const handlePromptChange = (event) => {
    const promptId = event.target.value;
    setSelectedPrompt(promptId);
    
    // Find the selected prompt
    const prompt = prompts.find(p => p.id === promptId);
    
    if (prompt) {
      // Extract variables from prompt content using regex
      const variables = extractVariables(prompt.prompt_content);
      
      // Initialize additional info state with extracted variables
      const initialAdditionalInfo = {};
      variables.forEach(variable => {
        initialAdditionalInfo[variable] = '';
      });
      
      setAdditionalInfo(initialAdditionalInfo);
      setShowAdditionalFields(variables.length > 0);
    } else {
      setAdditionalInfo({});
      setShowAdditionalFields(false);
    }
  };

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedPrompt) return;
    
    const selectedPromptData = prompts.find(p => p.id === selectedPrompt);
    
    if (!selectedPromptData) return;
    
    // Replace variables in the prompt content with user input
    let finalPromptContent = selectedPromptData.prompt_content;
    
    Object.entries(additionalInfo).forEach(([variable, value]) => {
      const regex = new RegExp(`{{${variable}}}`, 'g');
      finalPromptContent = finalPromptContent.replace(regex, value);
    });
    
    // Submit the final prompt with all data
    onSubmit({
      promptId: selectedPrompt,
      promptName: selectedPromptData.prompt_name,
      promptContent: finalPromptContent,
      model: selectedPromptData.model_used,
      additionalInfo,
      rawPrompt: selectedPromptData.prompt_content
    });
    
    // Inform the app to switch the sidebar selection to the Market Intel form
    window.dispatchEvent(
      new CustomEvent('menuSelect', { detail: 'marketIntel' })
    );
  };

  // Helper function to extract variables from prompt content
  const extractVariables = (content) => {
    const regex = /{{([^{}]+)}}/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    
    return matches;
  };

  const isFormValid = () => {
    if (!selectedPrompt) return false;
    
    // Check if all additional info fields are filled
    return Object.values(additionalInfo).every(value => value.trim() !== '');
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: isAestheticMode
            ? 'rgba(138, 116, 249, 0.1)'
            : 'rgba(20, 20, 35, 0.6)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: 'white',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}
      >
        <CircularProgress color={isAestheticMode ? 'secondary' : 'primary'} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: isAestheticMode
            ? 'rgba(138, 116, 249, 0.1)'
            : 'rgba(20, 20, 35, 0.6)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: 'white',
          width: '100%'
        }}
      >
        <Typography variant="h6" color="error">
          Error loading prompts: {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: isAestheticMode
          ? 'rgba(138, 116, 249, 0.1)'
          : 'rgba(20, 20, 35, 0.6)',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white',
        width: '100%',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'white',
        }}
      >
        Select AI Prompt
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
        Choose a prompt template to generate your content.
      </Typography>

      <FormControl 
        fullWidth 
        sx={{ 
          mb: 4,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(30, 30, 40, 0.4)',
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiSelect-select': {
            color: 'white',
          },
        }}
      >
        <InputLabel id="prompt-select-label">Select Prompt</InputLabel>
        <Select
          labelId="prompt-select-label"
          id="prompt-select"
          value={selectedPrompt}
          label="Select Prompt"
          onChange={handlePromptChange}
        >
          {prompts.map((prompt) => (
            <MenuItem key={prompt.id} value={prompt.id}>
              {prompt.prompt_name} - {prompt.report_type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showAdditionalFields && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Additional Information
          </Typography>
          <Grid container spacing={3}>
            {Object.keys(additionalInfo).map((variable) => (
              <Grid item xs={12} md={6} key={variable}>
                <TextField
                  fullWidth
                  label={variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  name={variable}
                  value={additionalInfo[variable]}
                  onChange={handleAdditionalInfoChange}
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(30, 30, 40, 0.4)',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid()}
          sx={{
            backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
            color: 'white',
            borderRadius: '8px',
            padding: '10px 24px',
            '&:hover': {
              backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.8)' : 'primary.dark',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default PromptSelector;
