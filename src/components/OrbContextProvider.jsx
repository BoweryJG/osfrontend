import React, { createContext, useContext, useState } from 'react';

// Create context
const OrbContext = createContext();

// Create a custom hook for using the context
export const useOrbContext = () => {
  const context = useContext(OrbContext);
  if (!context) {
    throw new Error('useOrbContext must be used within OrbContextProvider');
  }
  return context;
};

// Context provider component
export const OrbContextProvider = ({ children }) => {
  // Default gradient colors for the orb
  const [gradientColors, setGradientColors] = useState({
    start: '#00ffc6',
    end: '#7B42F6'
  });

  // Function to update gradient colors
  const updateGradientColors = (startColor, endColor) => {
    setGradientColors({
      start: startColor || gradientColors.start,
      end: endColor || gradientColors.end
    });
  };

  // Value to be provided by the context
  const value = {
    gradientColors,
    updateGradientColors
  };

  return (
    <OrbContext.Provider value={value}>
      {children}
    </OrbContext.Provider>
  );
};

export default OrbContextProvider;
