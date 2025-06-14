
import { useState, useRef, useCallback, useEffect } from "react";
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
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointer, setLastPointer] = useState({ x: 0, y: 0 });
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const sidebarTools = [
    { id: "add", icon: Plus, label: "Add" },
    { id: "filter", icon: Archive, label: "Filter" },
    { id: "history", icon: History, label: "History" },
    { id: "folder", icon: Archive, label: "Folder" },
    { id: "rocket", icon: Bell, label: "Rocket" },
    { id: "chat", icon: Bell, label: "Chat" },
    { id: "help", icon: Bell, label: "Help" }
  ];

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, transform.scale * scaleFactor));
      
      const scaleChange = newScale / transform.scale;
      const newX = mouseX - (mouseX - transform.x) * scaleChange;
      const newY = mouseY - (mouseY - transform.y) * scaleChange;
      
      setTransform({
        x: newX,
        y: newY,
        scale: newScale
      });
    } else {
      // Pan
      setTransform(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, [transform]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPointer({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPointer.x;
    const deltaY = e.clientY - lastPointer.y;
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastPointer({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPointer]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      // Handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Store initial distance if not set
      if (!canvasContainerRef.current?.dataset.initialDistance) {
        canvasContainerRef.current!.dataset.initialDistance = distance.toString();
        canvasContainerRef.current!.dataset.initialScale = transform.scale.toString();
        return;
      }
      
      const initialDistance = parseFloat(canvasContainerRef.current.dataset.initialDistance);
      const initialScale = parseFloat(canvasContainerRef.current.dataset.initialScale);
      const scaleFactor = distance / initialDistance;
      const newScale = Math.max(0.1, Math.min(5, initialScale * scaleFactor));
      
      setTransform(prev => ({
        ...prev,
        scale: newScale
      }));
    }
  }, [transform.scale]);

  const handleTouchEnd = useCallback(() => {
    if (canvasContainerRef.current) {
      delete canvasContainerRef.current.dataset.initialDistance;
      delete canvasContainerRef.current.dataset.initialScale;
    }
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Canvas Container */}
      <div 
        ref={canvasContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
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
              <Plus className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-lg font-medium">Start creating</p>
            <p className="text-sm text-zinc-600 mt-1">Click on tools to begin designing</p>
          </div>
        </div>
      </div>

      {/* Floating Left Sidebar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
        <div className="w-16 bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-full flex flex-col items-center py-6 shadow-2xl">
          {/* Top Tools */}
          <div className="flex flex-col space-y-3 mb-6">
            {sidebarTools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "ghost"}
                size="icon"
                className={`w-10 h-10 rounded-full ${
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
      </div>

      {/* Floating Top Navigation Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-full px-8 py-4 shadow-2xl">
          <div className="flex items-center justify-between min-w-[600px]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-zinc-700/50 rounded-full px-4 py-2">
                <Button variant="ghost" size="icon" className="w-6 h-6 text-zinc-400 hover:text-white rounded-full">
                  <Plus className="w-4 h-4" />
                </Button>
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

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="w-8 h-8 text-zinc-400 hover:text-white rounded-full">
                <Moon className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="bg-zinc-800/90 backdrop-blur-md border border-zinc-700/50 rounded-full px-4 py-2 text-zinc-300 text-sm">
          {Math.round(transform.scale * 100)}%
        </div>
      </div>
    </div>
  );
};

export default Canvas;
