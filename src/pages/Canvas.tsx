import React, { useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Sidebar } from "@/components/ui/sidebar";
import { sidebarTools } from "@/config/sidebar";
import { CanvasProvider, useCanvas } from "@/contexts/CanvasContext";
import { useCanvasOrchestration } from "@/hooks/useCanvasOrchestration";
import { ChatNode } from "@/components/canvas/nodes/ChatNode";
import { TextNode } from "@/components/canvas/nodes/TextNode";
import { VideoNode } from "@/components/canvas/nodes/VideoNode";
import { ImageNode } from "@/components/canvas/nodes/ImageNode";
import { AudioNode } from "@/components/canvas/nodes/AudioNode";
import { DocumentNode } from "@/components/canvas/nodes/DocumentNode";
import { WebsiteNode } from "@/components/canvas/nodes/WebsiteNode";
import { GroupNode } from "@/components/canvas/nodes/GroupNode";
import { Connection } from "@/components/canvas/Connection";
import { CanvasBackground } from "@/components/canvas/CanvasBackground";
import { CanvasGrid } from "@/components/canvas/CanvasGrid";
import { CanvasSelection } from "@/components/canvas/CanvasSelection";
import { CanvasConnecting } from "@/components/canvas/CanvasConnecting";

const Canvas = () => {
  const canvasOrchestration = useCanvasOrchestration();

  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    nodes,
    connections,
    selectedNodeIds,
    isDragging,
    isConnecting,
    connectingInfo,
    liveEndPoint,
    transform,
    canvasState,
    setTransform,
    setSelectedNodeIds,
  } = useCanvas();

  const {
    addChatNode,
    addTextNode,
    addVideoNode,
    addImageNode,
    addAudioNode,
    addDocumentNode,
    addWebsiteNode,
    addGroupNode,
    deleteNode,
    duplicateNode,
    startConnection,
    endConnection,
    deleteConnection,
    moveNodesToFront,
    canvasHandlers,
    canvasInteraction,
    canvasEvents,
    canvasTransform,
    chatNodes,
    textNodes,
    videoNodes,
    audioNodes,
    imageNodes,
    documentNodes,
    websiteNodes,
    groupNodes,
  } = canvasOrchestration;

  const handleSidebarAction = (toolId: string, data?: any) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    switch (toolId) {
      case "video":
        if (data?.url) {
          addVideoNode(centerX, centerY, data.url);
        }
        break;
      case "file-text":
        if (data?.files) {
          addDocumentNode(centerX, centerY, data.files);
        }
        break;
      case "text":
        addTextNode(centerX, centerY);
        break;
      case "website":
        if (data?.urls) {
          addWebsiteNode(centerX, centerY, data.urls);
        }
        break;
      case "image":
        if (data?.files) {
          addImageNode(centerX, centerY, data.files);
        }
        break;
      case "audio":
        addAudioNode(centerX, centerY);
        break;
      case "group":
        addGroupNode(centerX, centerY);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar tools={sidebarTools} onToolClick={handleSidebarAction} />
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0" ref={canvasRef}>
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            scaleX={transform.scale}
            scaleY={transform.scale}
            x={transform.x}
            y={transform.y}
            {...canvasEvents}
          >
            <Layer>
              <CanvasBackground />
              <CanvasGrid />
              {connections.map((connection) => (
                <Connection key={connection.id} connection={connection} />
              ))}
              {chatNodes.map((node) => (
                <ChatNode key={node.id} node={node} />
              ))}
              {textNodes.map((node) => (
                <TextNode key={node.id} node={node} />
              ))}
              {videoNodes.map((node) => (
                <VideoNode key={node.id} node={node} />
              ))}
              {imageNodes.map((node) => (
                <ImageNode key={node.id} node={node} />
              ))}
              {audioNodes.map((node) => (
                <AudioNode key={node.id} node={node} />
              ))}
              {documentNodes.map((node) => (
                <DocumentNode key={node.id} node={node} />
              ))}
              {websiteNodes.map((node) => (
                <WebsiteNode key={node.id} node={node} />
              ))}
              {groupNodes.map((node) => (
                <GroupNode key={node.id} node={node} />
              ))}
              <CanvasSelection />
              <CanvasConnecting />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
