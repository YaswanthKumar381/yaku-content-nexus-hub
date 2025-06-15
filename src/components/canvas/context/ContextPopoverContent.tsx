
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ContextPopoverContentProps {
  percentage: number;
  totalTokens: number;
  limit: number;
  bgColorClass: string;
}

export const ContextPopoverContent: React.FC<ContextPopoverContentProps> = ({
  percentage,
  totalTokens,
  limit,
  bgColorClass
}) => {
  const formattedTotal = totalTokens.toLocaleString();
  const formattedLimit = (limit / 1000).toLocaleString() + 'k';

  return (
    <div className="w-64 text-sm">
      <div className="font-bold mb-2">Context Usage</div>
      <p className="text-xs text-gray-600 dark:text-gray-300">
        The AI's context window is at {Math.round(percentage)}% capacity.
      </p>
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
    </div>
  );
};
