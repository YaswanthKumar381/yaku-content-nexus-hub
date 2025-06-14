
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  Moon,
  User,
  Settings,
  History,
  Archive,
  Bell
} from "lucide-react";

const Canvas = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");

  const sidebarTools = [
    { id: "add", icon: Plus, label: "Add" },
    { id: "filter", icon: Archive, label: "Filter" },
    { id: "history", icon: History, label: "History" },
    { id: "folder", icon: Archive, label: "Folder" },
    { id: "rocket", icon: Bell, label: "Rocket" },
    { id: "chat", icon: Bell, label: "Chat" },
    { id: "help", icon: Bell, label: "Help" }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Left Sidebar */}
      <div className="w-16 bg-zinc-800 border-r border-zinc-700 flex flex-col items-center py-4">
        {/* Top Tools */}
        <div className="flex flex-col space-y-3 mb-6">
          {sidebarTools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "default" : "ghost"}
              size="icon"
              className={`w-10 h-10 rounded-lg ${
                selectedTool === tool.id 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <tool.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>

        {/* Bottom User Avatar */}
        <div className="mt-auto">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600"
          >
            <User className="w-5 h-5 text-zinc-300" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="h-16 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-zinc-700 rounded-lg px-3 py-1">
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white">
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-white">
              <Moon className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-900 relative overflow-hidden">
          {/* Dotted Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle, #6b7280 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            ></div>
          </div>

          {/* Canvas Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <div className="text-center text-zinc-500">
              <div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-lg font-medium">Start creating</p>
              <p className="text-sm text-zinc-600 mt-1">Click on tools to begin designing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
