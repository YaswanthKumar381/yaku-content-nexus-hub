
import React from "react";
import { Video } from "lucide-react";
import { Transform } from "@/types/canvas";

interface CanvasBackgroundProps {
  transform: Transform;
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({ transform }) => {
  return (
    <>
      {/* Infinite Dotted Grid Background */}
      <div 
        className="absolute opacity-20"
        style={{
          left: -10000,
          top: -10000,
          width: 20000,
          height: 20000,
          backgroundImage: `radial-gradient(circle, #6b7280 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Canvas Content - Centered placeholder */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-center text-zinc-500">
          <div className="w-24 h-24 bg-zinc-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
            <Video className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-lg font-medium">Start creating</p>
          <p className="text-sm text-zinc-600 mt-1">Drag video icon to add videos</p>
        </div>
      </div>
    </>
  );
};
