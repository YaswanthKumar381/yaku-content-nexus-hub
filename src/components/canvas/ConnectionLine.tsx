
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
    chat: '#A855F7', // purple-500
    website: '#10B981', // emerald-500
    audio: '#F59E0B', // amber-500
    image: '#8B5CF6', // violet-500
    group: '#6B7280', // gray-500
};

const targetColor = '#8B5CF6'; // violet-500

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ id, sourceX, sourceY, targetX, targetY, isDarkMode = false, onDelete, sourceType }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const dx = targetX - sourceX;
  const path = `M ${sourceX},${sourceY} C ${sourceX + dx * 0.5},${sourceY} ${targetX - dx * 0.5},${targetY} ${targetX},${targetY}`;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const sourceColor = sourceColorMap[sourceType] || sourceColorMap.chat;
  const gradientId = `grad-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  const glowGradientId = `glow-grad-${id.replace(/[^a-zA-Z0-9]/g, '')}`;

  const gradient = (
    <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
      <stop offset="0%" stopColor={sourceColor} />
      <stop offset="95%" stopColor={targetColor} />
    </linearGradient>
  );

  const glowGradient = (
    <linearGradient id={glowGradientId} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
      <stop offset="0%" stopColor={sourceColor} stopOpacity="0.8" />
      <stop offset="95%" stopColor={targetColor} stopOpacity="0.8" />
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
      <defs>
        {gradient}
        {glowGradient}
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g 
        className="pointer-events-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleDelete}
      >
        {/* Glow effect when hovered */}
        {isHovered && (
          <path
            d={path}
            fill="none"
            stroke={`url(#${glowGradientId})`}
            strokeWidth="8"
            filter={`url(#glow-${id})`}
            opacity="0.6"
          />
        )}
        
        {/* Main visible path */}
        <path
          d={path}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={isHovered ? "3" : "2"}
          strokeDasharray="5 5"
          className="animated-path transition-all duration-200"
        />
        
        {/* Interaction path - wider and transparent */}
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth="20"
        />

        {/* Connection dots with glow effect when hovered */}
        <circle
          cx={sourceX}
          cy={sourceY}
          r={isHovered ? "4" : "3"}
          fill={sourceColor}
          filter={isHovered ? `url(#glow-${id})` : undefined}
          className="transition-all duration-200"
        />
        <circle
          cx={targetX}
          cy={targetY}
          r={isHovered ? "4" : "3"}
          fill={targetColor}
          filter={isHovered ? `url(#glow-${id})` : undefined}
          className="transition-all duration-200"
        />
      </g>
    </svg>
  );
};
