
import { useState } from "react";
import { useVideoNodes } from "@/hooks/useVideoNodes";
import { useDocumentNodes } from "@/hooks/useDocumentNodes";
import { useChatNodes } from "@/hooks/useChatNodes";
import { useTextNodes } from "@/hooks/useTextNodes";
import { useWebsiteNodes } from "@/hooks/useWebsiteNodes";
import { useAudioNodes } from "@/hooks/useAudioNodes";
import { useConnections } from "@/hooks/useConnections";
import { useContextUsage } from "@/hooks/useContextUsage";
import { useImageNodes } from "@/hooks/useImageNodes";
import { useGroupNodes } from "@/hooks/useGroupNodes";

interface useCanvasNodesProps {
  onNodeClick: (nodeId: string) => void;
}

export const useCanvasNodes = ({ onNodeClick }: useCanvasNodesProps) => {
  const videoNodesResult = useVideoNodes({ onNodeClick });
  const documentNodesResult = useDocumentNodes({ onNodeClick });
  const chatNodesResult = useChatNodes({ onNodeClick });
  const textNodesResult = useTextNodes({ onNodeClick });
  const websiteNodesResult = useWebsiteNodes({ onNodeClick });
  const audioNodesResult = useAudioNodes({ onNodeClick });
  const imageNodesResult = useImageNodes({ onNodeClick });
  const groupNodesResult = useGroupNodes({ onNodeClick });

  const [uploadTargetNodeId, setUploadTargetNodeId] = useState<string | null>(null);

  const allNodes = [
    ...videoNodesResult.videoNodes,
    ...documentNodesResult.documentNodes,
    ...chatNodesResult.chatNodes,
    ...textNodesResult.textNodes,
    ...websiteNodesResult.websiteNodes,
    ...audioNodesResult.audioNodes,
    ...imageNodesResult.imageNodes,
    ...groupNodesResult.groupNodes
  ];
  
  const allNodesMap = new Map(allNodes.map(node => [node.id, node]));

  const connectionsResult = useConnections(allNodesMap);
  const contextUsage = useContextUsage(allNodesMap, connectionsResult.connections, chatNodesResult.chatNodes);

  return {
    videoNodesResult,
    documentNodesResult,
    chatNodesResult,
    textNodesResult,
    websiteNodesResult,
    audioNodesResult,
    imageNodesResult,
    groupNodesResult,
    connectionsResult,
    contextUsage,
    allNodesMap,
    uploadTargetNodeId,
    setUploadTargetNodeId,
  };
};
