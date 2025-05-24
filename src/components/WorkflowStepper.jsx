import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button } from '@mui/material';
import MarketIntelForm from './MarketIntelForm';
import SalesStrategiesForm from './SalesStrategiesForm';
import DoctorReportForm from './DoctorReportForm';

const steps = ['Prospect Intelligence', 'Sales Strategies', 'Doctor Report'];

const WorkflowStepper = ({
  isAestheticMode = false,
  initialStep = 0,
  onMarketIntelSubmit,
  onSalesStrategiesSubmit,
  onDoctorReportSubmit,
}) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [marketIntelData, setMarketIntelData] = useState(null);
  const [salesStrategiesData, setSalesStrategiesData] = useState(null);

  const handleMarketIntel = (data) => {
    setMarketIntelData(data);
    if (onMarketIntelSubmit) onMarketIntelSubmit(data);
    setActiveStep(1);
  };

  const handleSalesStrategies = (data) => {
    setSalesStrategiesData(data);
    if (onSalesStrategiesSubmit) onSalesStrategiesSubmit(data);
    setActiveStep(2);
  };

  const handleDoctorReport = (data) => {
    if (onDoctorReportSubmit) {
      onDoctorReportSubmit({
        ...data,
        marketIntelData,
        salesStrategiesData,
      });
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <MarketIntelForm onSubmit={handleMarketIntel} isAestheticMode={isAestheticMode} />
        );
      case 1:
        return (
          <SalesStrategiesForm
            onSubmit={handleSalesStrategies}
            marketIntelData={marketIntelData}
            isAestheticMode={isAestheticMode}
          />
        );
      case 2:
        return (
          <DoctorReportForm
            onSubmit={handleDoctorReport}
            marketIntelData={marketIntelData}
            salesStrategiesData={salesStrategiesData}
            isAestheticMode={isAestheticMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderStepContent()}
      {activeStep > 0 && activeStep < steps.length && (
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
        </Box>
      )}
    </Box>
  );
};

export default WorkflowStepper;
