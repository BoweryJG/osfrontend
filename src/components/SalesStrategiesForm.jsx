import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Paper, Grid } from '@mui/material';

const SalesStrategiesForm = ({ onSubmit, marketIntelData, isAestheticMode = false }) => {
  const [formData, setFormData] = useState({
    product: marketIntelData?.product || '',
    challenges: '',
    benefits: '',
    location: marketIntelData ? `${marketIntelData.city}, ${marketIntelData.targetCloseDate}` : '',
    successDefinition: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const isFormValid = () => {
    return (
      formData.product.trim() !== '' &&
      formData.challenges.trim() !== '' &&
      formData.benefits.trim() !== '' &&
      formData.location.trim() !== '' &&
      formData.successDefinition.trim() !== ''
    );
  };

  // Check if Prospect Intel has been completed
  const isMarketIntelCompleted = !!marketIntelData;

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
        padding: '1.2rem',
        color: 'white',
        width: '100%',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'white',
        }}
      >
        Sales Strategies
      </Typography>

      {!isMarketIntelCompleted ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
            Complete the Prospect Intel form first.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{
              borderColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
              color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'primary.main',
            }}
          >
            Go to Prospect Intelligence
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
            Develop targeted sales strategies.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product"
                name="product"
                value={formData.product}
                onChange={handleChange}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Main Challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleChange}
                required
                multiline
                rows={3}
                variant="outlined"
                placeholder="What are the main challenges you face when selling this product?"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Main Benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                required
                multiline
                rows={3}
                variant="outlined"
                placeholder="What are the main benefits of your product?"
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Definition of Success"
                name="successDefinition"
                value={formData.successDefinition}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="e.g., 1 system sold in 3 months"
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
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
              Generate Sales Strategies
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SalesStrategiesForm;
