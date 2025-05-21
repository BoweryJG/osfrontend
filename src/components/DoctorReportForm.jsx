import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, Avatar, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { generateContent } from '../utils/openRouterClient';
import { incrementPromptUsage } from '../utils/supabaseClient';

const DoctorReportForm = ({
  onSubmit,
  marketIntelData,
  salesStrategiesData,
  isAestheticMode = false,
  selectedPromptData,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the prompt content
      let promptContent = selectedPromptData?.promptContent || 
        `Generate a comprehensive doctor report for ${marketIntelData.doctorName} about ${marketIntelData.product} in ${marketIntelData.city}, ${marketIntelData.state}.`;

      // If we don't have a selected prompt, create a default one
      if (!selectedPromptData) {
        // Replace variables in the prompt with actual data
        Object.entries(marketIntelData).forEach(([key, value]) => {
          promptContent = promptContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        
        if (salesStrategiesData) {
          Object.entries(salesStrategiesData).forEach(([key, value]) => {
            promptContent = promptContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
        }
      }

      // Generate content using the OpenRouter API
      const model = selectedPromptData?.model || 'gpt-4o';
      const systemPrompt = 'You are an expert medical marketing assistant. Generate detailed, professional reports for doctors based on the provided information.';
      
      const generatedContent = await generateContent(promptContent, model, systemPrompt);
      
      // If we have a selected prompt, increment its usage count
      if (selectedPromptData?.promptId) {
        try {
          await incrementPromptUsage(selectedPromptData.promptId);
          console.log('Prompt usage count incremented');
        } catch (err) {
          console.error('Error incrementing prompt usage count:', err);
          // Don't fail the whole operation if this fails
        }
      }
      
      setGeneratedReport(generatedContent);
      
      // Call the parent component's onSubmit with all data
      if (onSubmit) {
        onSubmit({
          marketIntelData,
          salesStrategiesData,
          generatedReport: generatedContent,
          promptData: selectedPromptData
        });
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            mb: 4,
          }}
        >
          <Typography variant="body1" color="error">
            Error: {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Please try again or contact support if the issue persists.
          </Typography>
        </Paper>
      )}

      {generatedReport && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(46, 125, 50, 0.3)',
            mb: 4,
            maxHeight: '300px',
            overflow: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Generated Report
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {generatedReport}
          </Typography>
        </Paper>
      )}

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
            onClick={() =>
              window.dispatchEvent(new CustomEvent('menuSelect', { detail: 'salesStrategies' }))
            }
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
            disabled={loading}
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
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Generating...
              </>
            ) : (
              'Generate Doctor-Ready Report'
            )}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default DoctorReportForm;
