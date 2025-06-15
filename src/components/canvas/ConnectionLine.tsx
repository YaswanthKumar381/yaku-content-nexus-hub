
import React, { useState } from 'react';
import { CanvasNode } from '@/types/canvas';

interface ConnectionLineProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isDarkMode?: boolean;
  onDelete: (id: string) => void;
  sourceType: CanvasNode['type'];
}

const sourceColorMap: Record<CanvasNode['type'], string> = {
    video: '#EF4444', // red-500
    document: '#3B82F6', // blue-500
    text: '#F97316', // orange-500
    chat: '#A855F7' // purple-500
};

const targetColor = '#8B5CF6'; // violet-500

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ id, sourceX, sourceY, targetX, targetY, isDarkMode = false, onDelete, sourceType }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const dx = targetX - sourceX;
  const path = `M ${sourceX},${sourceY} C ${sourceX + dx * 0.5},${sourceY} ${targetX - dx * 0.5},${targetY} ${targetX},${targetY}`;

  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const sourceColor = sourceColorMap[sourceType] || sourceColorMap.chat;
  const gradientId = `grad-${id.replace(/[^a-zA-Z0-9]/g, '')}`;

  const gradient = (
    <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
      <stop offset="0%" stopColor={sourceColor} />
      <stop offset="95%" stopColor={targetColor} />
    </linearGradient>
  );

  // The live connection line should not be interactive
  if (id === 'live-connection') {
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <defs>{gradient}</defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeDasharray="5 5"
          className="animated-path"
        />
      </svg>
    )
  }

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <defs>{gradient}</defs>
      <g 
        className="pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visible path */}
        <path
          d={path}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeDasharray="5 5"
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
