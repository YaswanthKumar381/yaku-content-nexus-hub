
import React, { useState } from 'react';

interface ConnectionLineProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isDarkMode?: boolean;
  onDelete: (id: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ id, sourceX, sourceY, targetX, targetY, isDarkMode = false, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const dx = targetX - sourceX;
  const path = `M ${sourceX},${sourceY} C ${sourceX + dx * 0.5},${sourceY} ${targetX - dx * 0.5},${targetY} ${targetX},${targetY}`;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  // The live connection line should not be interactive
  if (id === 'live-connection') {
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <path
          d={path}
          fill="none"
          stroke={isDarkMode ? 'rgba(192, 132, 252, 0.6)' : 'rgba(129, 64, 215, 0.8)'}
          strokeWidth="2"
          className="animated-path"
        />
      </svg>
    )
  }

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <g 
        className="pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visible path */}
        <path
          d={path}
          fill="none"
          stroke={isDarkMode ? 'rgba(192, 132, 252, 0.6)' : 'rgba(129, 64, 215, 0.8)'}
          strokeWidth="2"
          className="animated-path"
        />
        {/* Interaction path - wider and transparent */}
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth="20"
          className="cursor-pointer"
        />

        {isHovered && (
          <g transform={`translate(${midX}, ${midY})`} onClick={handleDelete} className="cursor-pointer">
            <title>Delete Connection</title>
            <circle r="12" fill="white" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-5" y1="5" x2="5" y2="-5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};
