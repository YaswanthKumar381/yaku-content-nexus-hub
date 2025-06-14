
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  Moon 
} from "lucide-react";

export const CanvasNavigation: React.FC = () => {
  return (
    <>
      {/* Floating Top Navigation Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-full px-8 py-4 shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-zinc-700/50 rounded-full px-4 py-2">
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white rounded-full">
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white rounded-full">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Corner - Moon and Green Bubble */}
      <div className="fixed top-4 right-4 z-20">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="w-10 h-10 text-zinc-400 hover:text-white rounded-full bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50">
            <Moon className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};
