import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainLayout from './components/MainLayout';
import ContentArea from './components/ContentArea';
import OutputPreview from './components/OutputPreview';
import WorkflowStepper from './components/WorkflowStepper';
import ModelPicker from './components/ModelPicker';
import PromptSelector from './components/PromptSelector';
import CosmicBackground from './CosmicBackground';
import Navbar from './components/Navbar';
import OrbContextProvider from './components/OrbContextProvider';
import AnalyticsDashboard from './components/AnalyticsDashboard';

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
          overflow: 'auto',
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
  const [selectedPromptData, setSelectedPromptData] = useState(null);
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

  // Add event listener for custom navigation events
  React.useEffect(() => {
    const handleNavigate = (event) => {
      if (event.detail) {
        setSelectedOption(event.detail);
      }
    };
    
    window.addEventListener('navigate', handleNavigate);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  const handleMarketIntelSubmit = (data) => {
    setMarketIntelData(data);
    
    // Generate mock content for the output preview
    setOutputSections({
      marketAnalysis: `Market analysis for ${data.product} in ${data.city}, ${data.state} over the next ${data.timeframe}. This section would contain detailed market insights tailored to Dr. ${data.doctorName}'s practice.`,
      industryOverview: `Industry overview for medical devices similar to ${data.product} in the ${data.city} area. This section would analyze industry trends and growth projections.`,
      competitiveLandscape: `Competitive landscape analysis for ${data.product} providers in ${data.city}, ${data.state}. This section would identify key competitors and their market positioning.`,
    });

    // Move to the next step in the workflow
    setSelectedOption('salesStrategies');
  };

  const handleSalesStrategiesSubmit = (data) => {
    setSalesStrategiesData(data);
    
    // Update the output preview with sales strategies content
    setOutputSections(prev => ({
      ...prev,
      marketAnalysis: prev.marketAnalysis + `\n\nKey challenges identified: ${data.challenges}`,
      competitiveLandscape: prev.competitiveLandscape + `\n\nProduct benefits to highlight: ${data.benefits}`,
    }));
    
    // Navigate to the doctor report section after submitting sales strategies
    setSelectedOption('doctorReport');
  };

  const handleDoctorReportSubmit = (data) => {
    // Log the generated report data
    console.log('Doctor report generated:', data);
    
    // Update the output sections with the generated report
    if (data.generatedReport) {
      setOutputSections(prev => ({
        ...prev,
        marketAnalysis: data.generatedReport.substring(0, 500) + '...',
        industryOverview: 'Generated using ' + (data.promptData?.promptName || 'default prompt'),
        competitiveLandscape: 'Model used: ' + (data.promptData?.model || 'gpt-4o'),
      }));
    }
    
    // Show a success message
    alert(`Doctor-Ready Report generated for Dr. ${data.marketIntelData.doctorName} on ${data.marketIntelData.product}`);
  };

  const handlePromptSelect = (promptData) => {
    setSelectedPromptData(promptData);
    console.log('Selected prompt:', promptData);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'pickModel':
        return (
          <ContentArea>
            <ModelPicker isAestheticMode={isAestheticMode} />
          </ContentArea>
        );
      case 'selectPrompt':
        return (
          <ContentArea>
            <PromptSelector
              onSubmit={handlePromptSelect}
              isAestheticMode={isAestheticMode}
            />
          </ContentArea>
        );
      case 'marketIntel':
      case 'salesStrategies':
      case 'doctorReport':
        const stepMap = { marketIntel: 0, salesStrategies: 1, doctorReport: 2 };
        return (
          <ContentArea>
            <WorkflowStepper
              initialStep={stepMap[selectedOption]}
              onMarketIntelSubmit={handleMarketIntelSubmit}
              onSalesStrategiesSubmit={handleSalesStrategiesSubmit}
              onDoctorReportSubmit={handleDoctorReportSubmit}
              isAestheticMode={isAestheticMode}
            />
          </ContentArea>
        );
      case 'analytics':
        return (
          <ContentArea>
            <AnalyticsDashboard isAestheticMode={isAestheticMode} />
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
      <OrbContextProvider>
        <Navbar
          isAestheticMode={isAestheticMode}
          toggleAestheticMode={toggleAestheticMode}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <MainLayout>
            <Sidebar selectedOption={selectedOption} onOptionSelect={handleOptionSelect} />
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, side-by-side on desktop
              flex: 1, 
              gap: '2rem',
              overflow: 'auto' // Ensure content can scroll on small screens
            }}>
              {renderContent()}
              <OutputPreview sections={outputSections} isAestheticMode={isAestheticMode} />
            </Box>
          </MainLayout>
        </Box>
      </OrbContextProvider>
    </ThemeProvider>
  );
}

export default App;
