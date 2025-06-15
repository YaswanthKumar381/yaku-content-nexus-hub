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

export const useCanvasNodes = () => {
  const videoNodesResult = useVideoNodes();
  const documentNodesResult = useDocumentNodes();
  const chatNodesResult = useChatNodes();
  const textNodesResult = useTextNodes();
  const websiteNodesResult = useWebsiteNodes();
  const audioNodesResult = useAudioNodes();
  const imageNodesResult = useImageNodes();

  const [uploadTargetNodeId, setUploadTargetNodeId] = useState<string | null>(null);

  const allNodes = [
    ...videoNodesResult.videoNodes,
    ...documentNodesResult.documentNodes,
    ...chatNodesResult.chatNodes,
    ...textNodesResult.textNodes,
    ...websiteNodesResult.websiteNodes,
    ...audioNodesResult.audioNodes,
    ...imageNodesResult.imageNodes
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
    connectionsResult,
    contextUsage,
    allNodesMap,
    uploadTargetNodeId,
    setUploadTargetNodeId,
  };
};
