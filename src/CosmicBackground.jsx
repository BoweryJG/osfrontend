import React from 'react';

const CosmicBackground = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    pointerEvents: 'none',
    width: '100vw',
    height: '100vh',
    background: `
      radial-gradient(ellipse at 60% 30%, #8F9CFF33 0 40%, transparent 70%),
      radial-gradient(ellipse at 20% 80%, #D3BFFF22 0 30%, transparent 70%),
      #0B0F19
    `,
    opacity: 0.92,
    transition: 'background 0.6s',
    overflow: 'hidden',
  }}>
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <circle cx="5%" cy="10%" r="1.2" fill="white" opacity="0.11" />
      <circle cx="80%" cy="30%" r="1.8" fill="white" opacity="0.09" />
      <circle cx="60%" cy="80%" r="1.1" fill="white" opacity="0.13" />
      <circle cx="30%" cy="60%" r="1.5" fill="white" opacity="0.08" />
      <circle cx="90%" cy="90%" r="1.7" fill="white" opacity="0.10" />
    </svg>
  </div>
);

export default CosmicBackground;
