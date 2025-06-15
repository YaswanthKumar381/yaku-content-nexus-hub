
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  Moon,
  Sun,
  Settings
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SettingsPopover } from "./SettingsPopover";

export const CanvasNavigation: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <>
      {/* Floating Top Navigation Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50' : 'bg-white/90 border-gray-200/50'} backdrop-blur-md border rounded-full px-8 py-4 shadow-2xl`}>
          <div className="flex items-center justify-center">
            <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-zinc-700/50' : 'bg-gray-100/50'} rounded-full px-4 py-2`}>
              <Button variant="ghost" size="icon" className={`w-6 h-6 rounded-full ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className={`w-6 h-6 rounded-full ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className={`w-6 h-6 rounded-full ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right Corner - Theme Toggle and Green Bubble */}
      <div className="fixed top-4 right-4 z-20">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50 text-zinc-400 hover:text-white' : 'bg-white/90 border-gray-200/50 text-gray-500 hover:text-gray-900'} backdrop-blur-md border`}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <SettingsPopover />
            </PopoverContent>
          </Popover>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-zinc-800/90 border-zinc-700/50 text-zinc-400 hover:text-white' : 'bg-white/90 border-gray-200/50 text-gray-500 hover:text-gray-900'} backdrop-blur-md border`}
            onClick={toggleTheme}
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};
