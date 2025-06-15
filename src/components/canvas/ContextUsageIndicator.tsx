
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

  let colorClass = 'text-green-500';
  let bgColorClass = 'bg-green-500';
  if (percentage > 80) {
    colorClass = 'text-red-500';
    bgColorClass = 'bg-red-500';
  } else if (percentage > 60) {
    colorClass = 'text-yellow-500';
    bgColorClass = 'bg-yellow-500';
  }

  const formattedTotal = totalTokens.toLocaleString();
  const formattedLimit = (limit / 1000).toLocaleString() + 'k';

  return (
    <Popover>
        <PopoverTrigger asChild>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-zinc-900">
                <svg className="w-full h-full" viewBox="0 0 40 40" transform="rotate(-90)">
                    <circle
                        className={isDarkMode ? "stroke-zinc-800" : "stroke-gray-200"}
                        strokeWidth="4"
                        fill="transparent"
                        r={radius}
                        cx="20"
                        cy="20"
                    />
                    <circle
                        className={`${colorClass} transition-all duration-300 ease-in-out`}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx="20"
                        cy="20"
                    />
                </svg>
                <span className={`absolute text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                    {Math.round(percentage)}%
                </span>
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
