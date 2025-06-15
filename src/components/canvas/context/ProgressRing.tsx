
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressRingProps {
  percentage: number;
  colorClass: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ percentage, colorClass }) => {
  const { isDarkMode } = useTheme();
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" transform="rotate(-90)">
      <circle
        className={isDarkMode ? "stroke-zinc-700/50" : "stroke-gray-300/50"}
        strokeWidth="2"
        fill="transparent"
        r={radius}
        cx="20"
        cy="20"
      />
      {percentage > 0 && (
        <circle
          className={`${colorClass} transition-all duration-300 ease-in-out`}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
      )}
    </svg>
  );
};
