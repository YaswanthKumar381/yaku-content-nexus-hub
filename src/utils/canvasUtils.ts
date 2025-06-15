
import { VideoNode, DocumentNode, ChatNode } from "@/types/canvas";

export const getHandlePosition = (node: VideoNode | DocumentNode | ChatNode) => {
  switch (node.type) {
    case 'chat':
      // The handle is on the left of the 600px wide component.
      // So center of handle is (node.x - 300) - 16 + 8 = node.x - 308
      return { x: node.x - 308, y: node.y };
    case 'video':
      // The handle is on the right of the 320px (w-80) wide component.
      // So center of handle is (node.x + 160) + 8 = node.x + 168
      return { x: node.x + 168, y: node.y };
    case 'document':
      // The handle is on the right of the 256px (w-64) wide component.
      // So center of handle is (node.x + 128) + 8 = node.x + 136
      return { x: node.x + 136, y: node.y };
    default: {
      const _exhaustiveCheck: never = node;
      throw new Error(`Unhandled node type: ${(_exhaustiveCheck as any)?.type}`);
    }
  }
};
