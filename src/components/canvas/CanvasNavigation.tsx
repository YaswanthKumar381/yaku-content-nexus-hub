
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SettingsPopover } from "./SettingsPopover";
import { HomeIcon } from "../icons/animated/HomeIcon";
import { ArrowLeftIcon } from "../icons/animated/ArrowLeftIcon";
import { ArrowRightIcon } from "../icons/animated/ArrowRightIcon";
import { SettingsGearIcon } from "../icons/animated/SettingsGearIcon";
import { MoonIcon } from "../icons/animated/MoonIcon";
import { SunIcon } from "../icons/animated/SunIcon";
import { ContextUsageIndicator } from "./ContextUsageIndicator";
import { useNavigate } from "react-router-dom";

interface CanvasNavigationProps {
  contextUsage: {
    percentage: number;
    totalTokens: number;
    limit: number;
  };
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const CanvasNavigation: React.FC<CanvasNavigationProps> = ({ 
  contextUsage, 
  onUndo, 
  onRedo, 
  canUndo = false, 
  canRedo = false 
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const iconButtonClass = `w-6 h-6 rounded-full transition-all duration-200 ${
    isDarkMode
      ? "text-zinc-400 hover:text-white hover:bg-white/20"
      : "text-gray-500 hover:text-gray-900 hover:bg-black/20"
  }`;

  const disabledIconButtonClass = `w-6 h-6 rounded-full transition-all duration-200 ${
    isDarkMode
      ? "text-zinc-600 cursor-not-allowed opacity-50"
      : "text-gray-300 cursor-not-allowed opacity-50"
  }`;

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleUndoClick = () => {
    if (canUndo && onUndo) {
      console.log('Executing undo action');
      onUndo();
    }
  };

  const handleRedoClick = () => {
    if (canRedo && onRedo) {
      console.log('Executing redo action');
      onRedo();
    }
  };

  return (
    <>
      {/* Floating Top Navigation Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`flex items-center space-x-3 ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md border rounded-full px-6 py-3 shadow-lg`}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={iconButtonClass}
            onClick={handleHomeClick}
            title="Go to Dashboard"
          >
            <HomeIcon size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={canUndo ? iconButtonClass : disabledIconButtonClass}
            onClick={handleUndoClick}
            disabled={!canUndo}
            title={canUndo ? "Undo last action" : "No actions to undo"}
          >
            <ArrowLeftIcon size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={canRedo ? iconButtonClass : disabledIconButtonClass}
            onClick={handleRedoClick}
            disabled={!canRedo}
            title={canRedo ? "Redo last action" : "No actions to redo"}
          >
            <ArrowRightIcon size={16} />
          </Button>
        </div>
      </div>

      {/* Top Right Corner - Theme Toggle and Settings */}
      <div className="fixed top-4 right-4 z-20">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-white/20' : 'bg-white/90 border-gray-200/50 text-gray-500 hover:text-gray-900 hover:bg-black/20'} backdrop-blur-md border transition-all duration-200`}
              >
                <SettingsGearIcon size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <SettingsPopover />
            </PopoverContent>
          </Popover>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-white/20' : 'bg-white/90 border-gray-200/50 text-gray-500 hover:text-gray-900 hover:bg-black/20'} backdrop-blur-md border transition-all duration-200`}
            onClick={toggleTheme}
          >
            {isDarkMode ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </Button>
          <ContextUsageIndicator {...contextUsage} />
        </div>
      </div>
    </>
  );
};
