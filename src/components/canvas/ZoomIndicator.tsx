
import React from "react";

interface ZoomIndicatorProps {
  scale: number;
}

export const ZoomIndicator: React.FC<ZoomIndicatorProps> = ({ scale }) => {
  return (
    <div className="fixed bottom-4 right-4 z-20">
      <div className="bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-full px-4 py-2 text-zinc-300 text-sm">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};
