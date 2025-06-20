
import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { sidebarTools } from "@/config/sidebar";

const Canvas = () => {
  const handleSidebarAction = (toolId: string, data?: any) => {
    console.log('Sidebar action:', toolId, data);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex-1 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Canvas</h1>
            <p className="text-gray-600">Canvas functionality will be implemented here</p>
            <div className="mt-4 text-sm text-gray-500">
              Available tools: {sidebarTools.map(tool => tool.label).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
