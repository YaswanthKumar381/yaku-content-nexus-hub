import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Video, 
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
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [videoNodes, setVideoNodes] = useState<Array<{ id: string; x: number; y: number; url: string; title: string }>>([]);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [pendingVideoNode, setPendingVideoNode] = useState<{ x: number; y: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const sidebarTools = [
    { id: "video", icon: Video, label: "Video" },
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
      // Zoom - Fixed the zoom in/out logic
      const rect = canvasContainerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Fixed: Use consistent zoom factor and proper direction
      const zoomIntensity = 0.1;
      const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
      const newScale = Math.max(0.1, Math.min(5, transform.scale * zoom));
      
      const scaleChange = newScale / transform.scale;
      const newX = mouseX - (mouseX - transform.x) * scaleChange;
      const newY = mouseY - (mouseY - transform.y) * scaleChange;
      
      console.log('Zoom:', { deltaY: e.deltaY, zoom, newScale, currentScale: transform.scale });
      
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

  const handleVideoIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingVideo(true);
    e.dataTransfer.setData("text/plain", "video");
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingVideo) return;

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate position relative to canvas transform
    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    setPendingVideoNode({ x, y });
    setShowVideoInput(true);
    setIsDraggingVideo(false);
  }, [isDraggingVideo, transform]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleVideoUrlSubmit = useCallback(() => {
    if (!pendingVideoNode || !videoUrl.trim()) return;

    const newNode = {
      id: `video-${Date.now()}`,
      x: pendingVideoNode.x,
      y: pendingVideoNode.y,
      url: videoUrl,
      title: getVideoTitle(videoUrl)
    };

    setVideoNodes(prev => [...prev, newNode]);
    setShowVideoInput(false);
    setPendingVideoNode(null);
    setVideoUrl("");
  }, [pendingVideoNode, videoUrl]);

  const getVideoTitle = (url: string) => {
    // Extract title from URL or use default
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return "YouTube Video";
    } else if (url.includes('vimeo.com')) {
      return "Vimeo Video";
    }
    return "Video";
  };

  const getVideoThumbnail = (url: string) => {
    // Generate thumbnail URL for different video platforms
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return "/placeholder.svg";
  };

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
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
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
              <Video className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-lg font-medium">Start creating</p>
            <p className="text-sm text-zinc-600 mt-1">Drag video icon to add videos</p>
          </div>
        </div>

        {/* Video Nodes */}
        {videoNodes.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: node.x,
              top: node.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-64 border border-gray-200">
              <div className="relative">
                <img
                  src={getVideoThumbnail(node.url)}
                  alt={node.title}
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{node.title}</h3>
                <p className="text-xs text-gray-500 truncate">{node.url}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video URL Input Modal */}
      {showVideoInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Enter Video URL</h3>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVideoUrlSubmit();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVideoInput(false);
                  setPendingVideoNode(null);
                  setVideoUrl("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVideoUrlSubmit}
                disabled={!videoUrl.trim()}
              >
                Add Video
              </Button>
            </div>
          </div>
        </div>
      )}

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
                draggable={tool.id === "video"}
                onDragStart={tool.id === "video" ? handleVideoIconDragStart : undefined}
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
