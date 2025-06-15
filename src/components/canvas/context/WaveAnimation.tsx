
import React from 'react';

interface WaveAnimationProps {
  percentage: number;
  waveColor: string;
}

export const WaveAnimation: React.FC<WaveAnimationProps> = ({ percentage, waveColor }) => {
  if (percentage === 0) return null;

  // Calculate proper wave height based on percentage
  const waveHeightFromBottom = (percentage / 100) * 28;
  const waveY = 32 - waveHeightFromBottom;

  return (
    <div className="absolute inset-1 rounded-full overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 32 32"
        style={{ transform: 'rotate(0deg)' }}
      >
        <defs>
          <clipPath id="circle-clip">
            <circle cx="16" cy="16" r="15" />
          </clipPath>
        </defs>
        
        <g clipPath="url(#circle-clip)">
          {/* Bottom wave layer */}
          <path
            d={`M0,${waveY + 1} Q8,${waveY - 1} 16,${waveY + 1} T32,${waveY + 1} V32 H0 Z`}
            fill={waveColor}
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -16,0; 0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Middle wave layer */}
          <path
            d={`M0,${waveY} Q8,${waveY - 2} 16,${waveY} T32,${waveY} V32 H0 Z`}
            fill={waveColor}
            opacity="0.8"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 16,0; 0,0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Top wave layer */}
          <path
            d={`M0,${waveY - 1} Q8,${waveY - 3} 16,${waveY - 1} T32,${waveY - 1} V32 H0 Z`}
            fill={waveColor}
            opacity="1"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; -8,0; 0,0"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
};
