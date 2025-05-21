import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Paper, Grid, MenuItem } from '@mui/material';
import { fetchProcedures } from '../utils/supabaseClient';

const MarketIntelForm = ({ onSubmit, isAestheticMode = false }) => {
  const [formData, setFormData] = useState({
    doctorName: '',
    city: '',
    state: '',
    procedure: '',
    product: '',
    timeframe: '',
  });
  const [relativeMarket, setRelativeMarket] = useState('');
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProcedures();
        const sorted = (data || []).sort((a, b) => a.name.localeCompare(b.name));
        setProcedures(sorted);
      } catch (err) {
        // Fallback to static procedures
        setProcedures([
          { id: 'default', name: 'Standard Procedure' },
          { id: 'advanced', name: 'Advanced Procedure' },
        ]);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'product') {
      // Mock relative market size based on product
      setRelativeMarket('100');
    }
    if (name === 'city') {
      // Reduce the market size when city is specified
      setRelativeMarket((prev) => prev ? String(Number(prev) * 0.5) : '50');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
      // Navigate to sales strategies after submitting
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'salesStrategies' }));
    }
  };

  const isFormValid = () => {
    return (
      formData.doctorName.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.procedure.trim() !== '' &&
      formData.product.trim() !== '' &&
      formData.timeframe.trim() !== ''
    );
  };

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
        display: 'flex',
        flexDirection: 'column',
        minHeight: 400,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 2,
          mt: 1,
          color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'white',
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        Market Intelligence
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Doctor Name"
            name="doctorName"
            value={formData.doctorName}
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
            select
            label="Procedure"
            name="procedure"
            value={formData.procedure}
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
          >
            {procedures.map((p) => (
              <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Relative Market Size"
            name="relativeMarket"
            value={relativeMarket}
            InputProps={{ readOnly: true }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(30, 30, 40, 0.4)',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Target Close Date"
            type="date"
            name="state"
            value={formData.state}
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Timeframe (e.g., 3 months)"
            name="timeframe"
            value={formData.timeframe}
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
      </Grid>

      <Box sx={{ mt: 3, marginTop: 'auto' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isFormValid()}
          sx={{
            py: 1.8, // Taller button
            px: 5,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          Generate Market Intelligence
        </Button>
      </Box>
    </Paper>
  );
};

export default MarketIntelForm;
