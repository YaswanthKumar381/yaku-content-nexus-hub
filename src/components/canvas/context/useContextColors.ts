
import { useTheme } from '@/contexts/ThemeContext';

export const useContextColors = (percentage: number) => {
  const { isDarkMode } = useTheme();

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

  return { colorClass, bgColorClass, waveColor };
};
