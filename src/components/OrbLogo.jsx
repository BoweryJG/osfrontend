import React from 'react';
import { useOrbContext } from './OrbContextProvider';

const OrbLogo = ({ size = 32, style, ...props }) => {
  const { gradientColors } = useOrbContext();
  const id = React.useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ filter: 'drop-shadow(0 0 6px #7B42F6AA)', ...style }}
      {...props}
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={gradientColors.start} />
          <stop offset="100%" stopColor={gradientColors.end} />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill={`url(#${id})`} opacity="0.85" />
      <circle cx="16" cy="16" r="8" fill="#fff" opacity="0.08" />
    </svg>
  );
};

export default OrbLogo;
