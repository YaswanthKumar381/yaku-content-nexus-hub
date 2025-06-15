
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle } from 'lucide-react';

interface ContextUsageIndicatorProps {
  percentage: number;
  totalTokens: number;
  limit: number;
}

export const ContextUsageIndicator: React.FC<ContextUsageIndicatorProps> = ({ percentage, totalTokens, limit }) => {
  const { isDarkMode } = useTheme();
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let colorClass = 'text-transparent';
  let bgColorClass = 'bg-transparent';
  let waveColor = '#10b981'; // Default green

  if (percentage > 90) {
    colorClass = 'text-red-500';
    bgColorClass = 'bg-red-500';
    waveColor = '#ef4444';
  } else if (percentage > 80) {
    colorClass = 'text-orange-500 dark:text-orange-400';
    bgColorClass = 'bg-orange-500 dark:bg-orange-400';
    waveColor = isDarkMode ? '#fb923c' : '#f97316';
  } else if (percentage > 60) {
    colorClass = 'text-yellow-500 dark:text-yellow-400';
    bgColorClass = 'bg-yellow-500 dark:bg-yellow-400';
    waveColor = isDarkMode ? '#fbbf24' : '#eab308';
  } else if (percentage > 40) {
    colorClass = 'text-green-500 dark:text-green-400';
    bgColorClass = 'bg-green-500 dark:bg-green-400';
    waveColor = isDarkMode ? '#4ade80' : '#10b981';
  } else if (percentage > 0) {
    colorClass = 'text-green-800 dark:text-green-500';
    bgColorClass = 'bg-green-800 dark:bg-green-500';
    waveColor = isDarkMode ? '#10b981' : '#166534';
  }

  const formattedTotal = totalTokens.toLocaleString();
  const formattedLimit = (limit / 1000).toLocaleString() + 'k';

  // Calculate wave height based on percentage
  const waveHeight = Math.max(2, (percentage / 100) * 16);

  return (
    <Popover>
        <PopoverTrigger asChild>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-zinc-900 overflow-hidden">
                {/* Background circle */}
                <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md border`}></div>
                
                {/* Animated waves inside the circle */}
                {percentage > 0 && (
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
                      
                      {/* Wave layers for depth */}
                      <g clipPath="url(#circle-clip)">
                        {/* Bottom wave layer */}
                        <path
                          d={`M0,${32 - waveHeight * 0.8} Q8,${32 - waveHeight * 1.2} 16,${32 - waveHeight * 0.8} T32,${32 - waveHeight * 0.8} V32 H0 Z`}
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
                          d={`M0,${32 - waveHeight} Q8,${32 - waveHeight * 1.4} 16,${32 - waveHeight} T32,${32 - waveHeight} V32 H0 Z`}
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
                          d={`M0,${32 - waveHeight * 1.2} Q8,${32 - waveHeight * 1.6} 16,${32 - waveHeight * 1.2} T32,${32 - waveHeight * 1.2} V32 H0 Z`}
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
                )}

                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40" transform="rotate(-90)">
                    <circle
                        className={isDarkMode ? "stroke-zinc-700/50" : "stroke-gray-300/50"}
                        strokeWidth="2"
                        fill="transparent"
                        r={radius}
                        cx="20"
                        cy="20"
                    />
                    {percentage > 0 &&
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
                    }
                </svg>
                
                {/* Percentage text */}
                {percentage > 0 &&
                  <span className={`relative z-10 text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-800'} drop-shadow-sm`}>
                      {Math.round(percentage)}%
                  </span>
                }
            </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 text-sm">
            <div className="font-bold mb-2">Context Usage</div>
            <p className="text-xs text-gray-600 dark:text-gray-300">The AI's context window is at {Math.round(percentage)}% capacity.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
                <div className={`${bgColorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {formattedTotal} / {formattedLimit} tokens
            </p>
            {percentage > 80 && (
                <div className="flex items-start gap-2 text-xs text-red-500 mt-2 p-2 bg-red-500/10 rounded-md">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Warning: High context usage may affect response quality or cause errors.</span>
                </div>
            )}
        </PopoverContent>
    </Popover>
  );
};
