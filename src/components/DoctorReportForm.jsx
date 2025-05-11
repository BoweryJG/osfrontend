import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, Avatar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const DoctorReportForm = ({
  onSubmit,
  marketIntelData,
  salesStrategiesData,
  isAestheticMode = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        marketIntelData,
        salesStrategiesData,
      });
    }
  };

  // Check if previous forms have been completed
  const isMarketIntelCompleted = !!marketIntelData;
  const isSalesStrategiesCompleted = !!salesStrategiesData;
  const canGenerateReport = isMarketIntelCompleted && isSalesStrategiesCompleted;

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
        Doctor-Ready Report
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
        Generate a comprehensive report for your doctor based on market intelligence and sales strategies.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Prerequisites
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: isMarketIntelCompleted
                  ? 'rgba(46, 125, 50, 0.1)'
                  : 'rgba(211, 47, 47, 0.1)',
                borderRadius: '12px',
                border: `1px solid ${
                  isMarketIntelCompleted ? 'rgba(46, 125, 50, 0.3)' : 'rgba(211, 47, 47, 0.3)'
                }`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {isMarketIntelCompleted ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <ErrorOutlineIcon color="error" />
                )}
                <Typography variant="subtitle1" fontWeight={500}>
                  Market Intelligence
                </Typography>
              </Box>
              {isMarketIntelCompleted ? (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={`Doctor: ${marketIntelData.doctorName}`}
                    sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Chip
                    size="small"
                    label={`Product: ${marketIntelData.product}`}
                    sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Chip
                    size="small"
                    label={`Location: ${marketIntelData.city}, ${marketIntelData.state}`}
                    sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Please complete the Market Intelligence form first.
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: isSalesStrategiesCompleted
                  ? 'rgba(46, 125, 50, 0.1)'
                  : 'rgba(211, 47, 47, 0.1)',
                borderRadius: '12px',
                border: `1px solid ${
                  isSalesStrategiesCompleted ? 'rgba(46, 125, 50, 0.3)' : 'rgba(211, 47, 47, 0.3)'
                }`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {isSalesStrategiesCompleted ? (
                  <CheckCircleOutlineIcon color="success" />
                ) : (
                  <ErrorOutlineIcon color="error" />
                )}
                <Typography variant="subtitle1" fontWeight={500}>
                  Sales Strategies
                </Typography>
              </Box>
              {isSalesStrategiesCompleted ? (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={`Product: ${salesStrategiesData.product}`}
                    sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Chip
                    size="small"
                    label={`Location: ${salesStrategiesData.location}`}
                    sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Chip
                    size="small"
                    label={`Success: ${salesStrategiesData.successDefinition}`}
                    sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                </Box>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Please complete the Sales Strategies form first.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {!canGenerateReport ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
            Please complete both Market Intelligence and Sales Strategies forms to generate a Doctor-Ready Report.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{
              borderColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
              color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'primary.main',
              mr: 2,
            }}
            disabled={isMarketIntelCompleted}
          >
            Go to Market Intelligence
          </Button>
          <Button
            variant="outlined"
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'salesStrategies' }))}
            sx={{
              borderColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
              color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'primary.main',
            }}
            disabled={isSalesStrategiesCompleted || !isMarketIntelCompleted}
          >
            Go to Sales Strategies
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.6)' : 'primary.main',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 24px',
              '&:hover': {
                backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.8)' : 'primary.dark',
              },
            }}
          >
            Generate Doctor-Ready Report
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default DoctorReportForm;
