
import React from 'react';

interface ConnectionLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isDarkMode?: boolean;
  onDoubleClick?: (e: React.MouseEvent) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ sourceX, sourceY, targetX, targetY, isDarkMode = false, onDoubleClick }) => {
  const dx = targetX - sourceX;

  const path = `M ${sourceX},${sourceY} C ${sourceX + dx * 0.5},${sourceY} ${targetX - dx * 0.5},${targetY} ${targetX},${targetY}`;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <g onDoubleClick={onDoubleClick} className="cursor-pointer" style={{ pointerEvents: 'all' }}>
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth="10"
        />
        <path
          d={path}
          fill="none"
          stroke={isDarkMode ? 'rgba(192, 132, 252, 0.6)' : 'rgba(129, 64, 215, 0.8)'}
          strokeWidth="2"
          className="animated-path pointer-events-none"
        />
      </g>
    </svg>
  );
};
