import { useMemo } from 'react';
import { CanvasNode, ChatNode, Connection, DocumentNode, TextNode, VideoNode } from '@/types/canvas';
import { estimateTokenCount, getContextLimit } from '@/utils/tokenUtils';

const SYSTEM_PROMPT_TEXT = 'You are Yaku, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.';
const CONTEXT_WRAPPER_TEXT = "Here is some context from connected nodes:\n\n---\n\n---\n\nMy question is: ";

const getNodeContent = (node: CanvasNode, allNodesMap: Map<string, CanvasNode>): string => {
  switch (node.type) {
    case 'video':
      return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
    case 'document':
      const docContent = node.documents.map(d => `Document: ${d.fileName}\nContent: ${d.content || 'Content not available'}`).join('\n\n');
      return `Document Node Content:\n${docContent}`;
    case 'text':
      return `Text Note:\n${node.content || 'Not available'}`;
    case 'website':
      const websiteContent = node.websites.map(w => `Website: ${w.title}\nURL: ${w.url}\nContent: ${w.content || 'Content not available'}`).join('\n\n');
      return `Website Node Content:\n${websiteContent}`;
    case 'audio':
      const audioContent = node.recordings.map(r => `Audio Recording:\nTranscript: ${r.transcript || 'Transcript not available'}`).join('\n\n');
      return `Audio Node Content:\n${audioContent}`;
    case 'image':
      const imageContent = node.images.map(img => `Image: ${img.fileName}\nAnalysis: ${img.analysis || 'Image analysis not available'}`).join('\n\n');
      return `Image Node Content:\n${imageContent}`;
    case 'group':
      // For group nodes, we need to get the context of all contained nodes
      const groupContext = node.containedNodes.map(nodeId => {
        const containedNode = allNodesMap.get(nodeId);
        return containedNode ? getNodeContent(containedNode, allNodesMap) : '';
      }).filter(Boolean).join('\n\n');
      return `Group "${node.title}" Content:\n${groupContext || 'No content available'}`;
    case 'chat':
        return '';
    default:
      return '';
  }
};

export const useContextUsage = (
    allNodesMap: Map<string, CanvasNode>, 
    connections: Connection[], 
    chatNodes: ChatNode[]
) => {
    const maxUsage = useMemo(() => {
        const contextLimit = getContextLimit();
        
        if (chatNodes.length === 0) {
            return { percentage: 0, totalTokens: 0, limit: contextLimit };
        }

        let maxTokens = 0;

        for (const chatNode of chatNodes) {
            let currentTokens = 0;
            
            const systemMessage = chatNode.messages.find(m => m.role === 'system');
            const systemPrompt = systemMessage?.content || SYSTEM_PROMPT_TEXT;
            currentTokens += estimateTokenCount(systemPrompt);

            const historyText = chatNode.messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');
            currentTokens += estimateTokenCount(historyText);

            const connectedNodes = connections
                .filter(conn => conn.targetId === chatNode.id)
                .map(conn => allNodesMap.get(conn.sourceId))
                .filter((node): node is VideoNode | DocumentNode | TextNode | import('@/types/canvas').WebsiteNode | import('@/types/canvas').AudioNode | import('@/types/canvas').ImageNode | import('@/types/canvas').GroupNode => !!node && (node.type === 'video' || node.type === 'document' || node.type === 'text' || node.type === 'website' || node.type === 'audio' || node.type === 'image' || node.type === 'group'));
            
            if (connectedNodes.length > 0) {
              const contextText = connectedNodes.map(node => getNodeContent(node, allNodesMap)).join('\n\n---\n\n');
              let contextTokens = estimateTokenCount(contextText);
              contextTokens += estimateTokenCount(CONTEXT_WRAPPER_TEXT);
              currentTokens += contextTokens;
            }

            if (currentTokens > maxTokens) {
                maxTokens = currentTokens;
            }
        }
        
        const percentage = (maxTokens / contextLimit) * 100;

        return {
            percentage: Math.min(percentage, 100),
            totalTokens: maxTokens,
            limit: contextLimit
        };
    }, [allNodesMap, connections, chatNodes]);

    return maxUsage;
};
