
import { useMemo } from 'react';
import { CanvasNode, ChatNode, Connection, DocumentNode, TextNode, VideoNode } from '@/types/canvas';
import { estimateTokenCount, GEMINI_1_5_FLASH_CONTEXT_LIMIT } from '@/utils/tokenUtils';

const SYSTEM_PROMPT_TEXT = 'You are Yaku, a helpful AI assistant. Use the provided context from connected nodes to answer user questions.';
const CONTEXT_WRAPPER_TEXT = "Here is some context from connected nodes:\n\n---\n\n---\n\nMy question is: ";

const getNodeContent = (node: CanvasNode): string => {
  switch (node.type) {
    case 'video':
      return `Video Title: ${node.title}\nTranscript: ${node.context || 'Not available'}`;
    case 'document':
      const docContent = node.documents.map(d => `Document: ${d.fileName}\nContent: ${d.content || 'Content not available'}`).join('\n\n');
      return `Document Node Content:\n${docContent}`;
    case 'text':
      return `Text Note:\n${node.content || 'Not available'}`;
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
        if (chatNodes.length === 0) {
            return { percentage: 0, totalTokens: 0, limit: GEMINI_1_5_FLASH_CONTEXT_LIMIT };
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
                .filter((node): node is VideoNode | DocumentNode | TextNode => !!node && (node.type === 'video' || node.type === 'document' || node.type === 'text'));
            
            if (connectedNodes.length > 0) {
              const contextText = connectedNodes.map(getNodeContent).join('\n\n---\n\n');
              let contextTokens = estimateTokenCount(contextText);
              contextTokens += estimateTokenCount(CONTEXT_WRAPPER_TEXT);
              currentTokens += contextTokens;
            }

            if (currentTokens > maxTokens) {
                maxTokens = currentTokens;
            }
        }
        
        const percentage = (maxTokens / GEMINI_1_5_FLASH_CONTEXT_LIMIT) * 100;

        return {
            percentage: Math.min(percentage, 100),
            totalTokens: maxTokens,
            limit: GEMINI_1_5_FLASH_CONTEXT_LIMIT
        };
    }, [allNodesMap, connections, chatNodes]);

    return maxUsage;
};
