import { useState, useCallback } from "react";
import { Video, Archive, History, Bell } from "lucide-react";
import { VideoNode, SidebarTool } from "@/types/canvas";
import { useCanvasTransform } from "@/hooks/useCanvasTransform";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { VideoNodeComponent } from "@/components/canvas/VideoNodeComponent";
import { VideoInputModal } from "@/components/canvas/VideoInputModal";
import { TranscriptModal } from "@/components/canvas/TranscriptModal";
import { CanvasSidebar } from "@/components/canvas/CanvasSidebar";
import { CanvasNavigation } from "@/components/canvas/CanvasNavigation";

const Canvas = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [pendingVideoNode, setPendingVideoNode] = useState<{ x: number; y: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [showTranscriptPopup, setShowTranscriptPopup] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [transcriptError, setTranscriptError] = useState("");
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const {
    transform,
    canvasContainerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCanvasTransform();

  const {
    videoNodes,
    draggingNodeId,
    addVideoNode,
    updateVideoNode,
    moveVideoNode,
    handleNodePointerDown,
    handleNodePointerUp
  } = useVideoNodes();

  const sidebarTools: SidebarTool[] = [
    { id: "video", icon: Video, label: "Video" },
    { id: "filter", icon: Archive, label: "Filter" },
    { id: "history", icon: History, label: "History" },
    { id: "folder", icon: Archive, label: "Folder" },
    { id: "rocket", icon: Bell, label: "Rocket" },
    { id: "chat", icon: Bell, label: "Chat" },
    { id: "help", icon: Bell, label: "Help" }
  ];

  const handleVideoIconDragStart = useCallback((e: React.DragEvent) => {
    setIsDraggingVideo(true);
    e.dataTransfer.setData("text/plain", "video");
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDraggingVideo) return;

    const rect = canvasContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - transform.x) / transform.scale;
    const y = (e.clientY - rect.top - transform.y) / transform.scale;

    setPendingVideoNode({ x, y });
    setShowVideoInput(true);
    setIsDraggingVideo(false);
  }, [isDraggingVideo, transform]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleVideoUrlSubmit = useCallback(async () => {
    if (!pendingVideoNode || !videoUrl.trim()) return;

    setIsCreatingNode(true);
    console.log("🎬 Creating video node with URL:", videoUrl);

    try {
      await addVideoNode(pendingVideoNode.x, pendingVideoNode.y, videoUrl);
      setShowVideoInput(false);
      setPendingVideoNode(null);
      setVideoUrl("");
      console.log("✅ Video node created successfully");
    } catch (error) {
      console.error("❌ Error creating video node:", error);
    } finally {
      setIsCreatingNode(false);
    }
  }, [pendingVideoNode, videoUrl, addVideoNode]);

  const handleTranscriptClick = async (e: React.MouseEvent, node: VideoNode) => {
    console.log("🎯 Transcript button clicked for:", node.url);
    e.stopPropagation();
    e.preventDefault();
    
    // Immediately reset any dragging state when opening transcript modal
    if (draggingNodeId) {
      const canvasContainer = canvasContainerRef.current;
      if (canvasContainer) {
        // Release any active pointer captures
        try {
          canvasContainer.releasePointerCapture(0);
        } catch (e) {
          // Ignore capture release errors
        }
      }
      // Force reset dragging state
      handleNodePointerUp({ 
        target: { releasePointerCapture: () => {} },
        pointerId: 0
      } as any);
    }
    
    setCurrentVideoUrl(node.url);
    setShowTranscriptPopup(true);
    setCurrentTranscript("");
    setTranscriptError("");
  };

  const handleTranscriptModalClose = useCallback(() => {
    console.log("🔽 Closing transcript popup");
    setShowTranscriptPopup(false);
    setCurrentTranscript("");
    setTranscriptError("");
    setCurrentVideoUrl("");
    
    // Force complete reset of dragging state
    if (draggingNodeId) {
      const canvasContainer = canvasContainerRef.current;
      if (canvasContainer) {
        // Release all possible pointer captures
        for (let i = 0; i < 10; i++) {
          try {
            canvasContainer.releasePointerCapture(i);
          } catch (e) {
            // Ignore capture release errors
          }
        }
      }
      
      // Force reset using the hook
      handleNodePointerUp({ 
        target: { releasePointerCapture: () => {} },
        pointerId: 0
      } as any);
    }
  }, [draggingNodeId, handleNodePointerUp]);

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Canvas Container */}
      <div 
        ref={canvasContainerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={(e) => handlePointerDown(e, draggingNodeId)}
        onPointerMove={(e) => handlePointerMove(e, draggingNodeId, (deltaX, deltaY) => {
          if (draggingNodeId) {
            moveVideoNode(draggingNodeId, deltaX, deltaY, transform.scale);
          }
        })}
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
          <VideoNodeComponent
            key={node.id}
            node={node}
            onPointerDown={handleNodePointerDown}
            onTranscriptClick={handleTranscriptClick}
          />
        ))}
      </div>

      {/* Video URL Input Modal */}
      <VideoInputModal
        isOpen={showVideoInput}
        videoUrl={videoUrl}
        isCreating={isCreatingNode}
        onUrlChange={setVideoUrl}
        onSubmit={handleVideoUrlSubmit}
        onCancel={() => {
          setShowVideoInput(false);
          setPendingVideoNode(null);
          setVideoUrl("");
        }}
      />

      {/* Transcript Options Popup */}
      <TranscriptModal
        isOpen={showTranscriptPopup}
        videoUrl={currentVideoUrl}
        transcript={currentTranscript}
        error={transcriptError}
        onClose={handleTranscriptModalClose}
        onTranscriptChange={setCurrentTranscript}
        onSave={() => {
          updateVideoNode(
            videoNodes.find(node => node.url === currentVideoUrl)?.id || '',
            { context: currentTranscript }
          );
          handleTranscriptModalClose();
        }}
      />

      {/* Floating Left Sidebar */}
      <CanvasSidebar
        tools={sidebarTools}
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onVideoDragStart={handleVideoIconDragStart}
      />

      {/* Navigation */}
      <CanvasNavigation />

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
