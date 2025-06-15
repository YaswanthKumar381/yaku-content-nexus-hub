
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmojiIcon } from './context/EmojiIcon';
import { WaveAnimation } from './context/WaveAnimation';
import { ProgressRing } from './context/ProgressRing';
import { ContextPopoverContent } from './context/ContextPopoverContent';
import { useContextColors } from './context/useContextColors';

interface ContextUsageIndicatorProps {
  percentage: number;
  totalTokens: number;
  limit: number;
}

export const ContextUsageIndicator: React.FC<ContextUsageIndicatorProps> = ({ 
  percentage, 
  totalTokens, 
  limit 
}) => {
  const { isDarkMode } = useTheme();
  const { colorClass, bgColorClass, waveColor } = useContextColors(percentage);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-zinc-900 overflow-hidden">
          {/* Background circle */}
          <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md border`}></div>
          
          {/* Animated waves inside the circle */}
          <WaveAnimation percentage={percentage} waveColor={waveColor} />

          {/* Progress ring */}
          <ProgressRing percentage={percentage} colorClass={colorClass} />
          
          {/* Animated Emoji Icon */}
          <EmojiIcon percentage={percentage} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <ContextPopoverContent
          percentage={percentage}
          totalTokens={totalTokens}
          limit={limit}
          bgColorClass={bgColorClass}
        />
      </PopoverContent>
    </Popover>
  );
};
