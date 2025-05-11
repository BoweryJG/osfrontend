import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainLayout from './components/MainLayout';
import ContentArea from './components/ContentArea';
import OutputPreview from './components/OutputPreview';
import MarketIntelForm from './components/MarketIntelForm';
import SalesStrategiesForm from './components/SalesStrategiesForm';
import DoctorReportForm from './components/DoctorReportForm';
import CosmicBackground from './CosmicBackground';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8A74F9',
    },
    background: {
      default: '#0A0A14',
      paper: 'rgba(20, 20, 35, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#0A0A14',
          color: '#FFFFFF',
        },
      },
    },
  },
});

function App() {
  const [isAestheticMode, setIsAestheticMode] = useState(true);
  const [selectedOption, setSelectedOption] = useState('marketIntel');
  const [marketIntelData, setMarketIntelData] = useState(null);
  const [salesStrategiesData, setSalesStrategiesData] = useState(null);
  const [outputSections, setOutputSections] = useState({
    marketAnalysis: '',
    industryOverview: '',
    competitiveLandscape: '',
  });

  const toggleAestheticMode = () => {
    setIsAestheticMode(!isAestheticMode);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleMarketIntelSubmit = (data) => {
    setMarketIntelData(data);
    
    // Generate mock content for the output preview
    setOutputSections({
      marketAnalysis: `Market analysis for ${data.product} in ${data.city}, ${data.state} over the next ${data.timeframe}. This section would contain detailed market insights tailored to Dr. ${data.doctorName}'s practice.`,
      industryOverview: `Industry overview for medical devices similar to ${data.product} in the ${data.city} area. This section would analyze industry trends and growth projections.`,
      competitiveLandscape: `Competitive landscape analysis for ${data.product} providers in ${data.city}, ${data.state}. This section would identify key competitors and their market positioning.`,
    });
  };

  const handleSalesStrategiesSubmit = (data) => {
    setSalesStrategiesData(data);
    
    // Update the output preview with sales strategies content
    setOutputSections(prev => ({
      ...prev,
      marketAnalysis: prev.marketAnalysis + `\n\nKey challenges identified: ${data.challenges}`,
      competitiveLandscape: prev.competitiveLandscape + `\n\nProduct benefits to highlight: ${data.benefits}`,
    }));
  };

  const handleDoctorReportSubmit = (data) => {
    // In a real app, this would generate a comprehensive report
    console.log('Generating doctor report with:', data);
    
    // For demo purposes, we'll just show an alert
    alert(`Doctor-Ready Report generated for Dr. ${data.marketIntelData.doctorName} on ${data.marketIntelData.product}`);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'pickModel':
        return (
          <ContentArea>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Pick Model
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              Model selection functionality would go here.
            </Typography>
          </ContentArea>
        );
      case 'marketIntel':
        return (
          <ContentArea>
            <MarketIntelForm 
              onSubmit={handleMarketIntelSubmit} 
              isAestheticMode={isAestheticMode} 
            />
          </ContentArea>
        );
      case 'salesStrategies':
        return (
          <ContentArea>
            <SalesStrategiesForm 
              onSubmit={handleSalesStrategiesSubmit} 
              marketIntelData={marketIntelData}
              isAestheticMode={isAestheticMode} 
            />
          </ContentArea>
        );
      case 'doctorReport':
        return (
          <ContentArea>
            <DoctorReportForm 
              onSubmit={handleDoctorReportSubmit}
              marketIntelData={marketIntelData}
              salesStrategiesData={salesStrategiesData}
              isAestheticMode={isAestheticMode} 
            />
          </ContentArea>
        );
      default:
        return (
          <ContentArea>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Select an option from the sidebar
            </Typography>
          </ContentArea>
        );
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CosmicBackground />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Header isAestheticMode={isAestheticMode} toggleAestheticMode={toggleAestheticMode} />
        <MainLayout>
          <Sidebar selectedOption={selectedOption} onOptionSelect={handleOptionSelect} />
          <Box sx={{ display: 'flex', flex: 1, gap: '2rem' }}>
            {renderContent()}
            <OutputPreview sections={outputSections} isAestheticMode={isAestheticMode} />
          </Box>
        </MainLayout>
      </Box>
    </ThemeProvider>
  );
}

export default App;
