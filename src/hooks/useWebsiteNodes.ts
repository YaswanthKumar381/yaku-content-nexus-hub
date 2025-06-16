import { useState, useCallback } from "react";
import { WebsiteNode, WebsiteData, Transform } from "@/types/canvas";
import { v4 as uuidv4 } from 'uuid';

export const useWebsiteNodes = () => {
  const [websiteNodes, setWebsiteNodes] = useState<WebsiteNode[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const fetchWebsiteContent = async (url: string): Promise<WebsiteData> => {
    try {
      console.log(`🌐 Fetching content for: ${url}`);
      
      // Use the new curl-based approach with individual URL requests
      const webhookUrl = "https://n8n-anrqdske.ap-southeast-1.clawcloudrun.com/webhook/website";
      const urlParams = new URLSearchParams();
      urlParams.append('url', url);
      
      const response = await fetch(`${webhookUrl}?${urlParams.toString()}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      console.log(`✅ Successfully fetched content for: ${url}. Length: ${htmlContent.length}`);
      
      if (htmlContent.length === 0) {
        console.warn(`⚠️ Received empty content for ${url}. Response status: ${response.status}`);
        return {
          url,
          title: new URL(url).hostname || url,
          content: `Failed to fetch content from ${url}. Received empty response from server.`,
          fetchedAt: new Date().toISOString(),
        };
      }

      const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
      
      return {
        url,
        title,
        content: htmlContent,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Error fetching website content for ${url}:`, error);
      return {
        url,
        title: new URL(url).hostname || url,
        content: `Failed to fetch content from ${url}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fetchedAt: new Date().toISOString(),
      };
    }
  };

  const addWebsiteNode = useCallback(async (x: number, y: number, urls: string[]): Promise<WebsiteNode> => {
    const nodeId = uuidv4();
    
    // Create the node first with empty websites array
    const newNode: WebsiteNode = {
      id: nodeId,
      x,
      y,
      type: 'website',
      websites: [],
    };

    setWebsiteNodes(prev => [...prev, newNode]);
    console.log("✅ Website node created:", newNode);
    
    // Fetch content for each URL individually, one at a time
    const websites: WebsiteData[] = [];
    for (const url of urls) {
      console.log(`🔄 Processing URL ${urls.indexOf(url) + 1}/${urls.length}: ${url}`);
      const websiteData = await fetchWebsiteContent(url);
      websites.push(websiteData);
      
      // Update the node with the new website data immediately
      setWebsiteNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, websites: [...websites] }
          : node
      ));
    }
    
    return { ...newNode, websites };
  }, []);

  const addWebsitesToNode = useCallback(async (nodeId: string, urls: string[]): Promise<void> => {
    // Process each URL individually, one at a time
    for (const url of urls) {
      console.log(`🔄 Adding URL to node ${nodeId}: ${url}`);
      const websiteData = await fetchWebsiteContent(url);
      
      setWebsiteNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, websites: [...node.websites, websiteData] }
          : node
      ));
    }
  }, []);

  const deleteWebsiteNode = useCallback((nodeId: string) => {
    setWebsiteNodes(prev => prev.filter(node => node.id !== nodeId));
  }, []);

  const deleteWebsite = useCallback((nodeId: string, websiteUrl: string) => {
    setWebsiteNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, websites: node.websites.filter(website => website.url !== websiteUrl) }
        : node
    ));
  }, []);

  const handleNodePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    console.log("🌐 Website node pointer down:", nodeId);
    e.stopPropagation();
    const node = websiteNodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingNodeId(nodeId);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [websiteNodes]);

  const moveWebsiteNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: Transform) => {
    const canvasRect = document.querySelector('.absolute.inset-0')?.getBoundingClientRect();
    if (!canvasRect) return;

    const x = (clientX - canvasRect.left - transform.x - dragOffset.x) / transform.scale;
    const y = (clientY - canvasRect.top - transform.y - dragOffset.y) / transform.scale;

    console.log("🔄 Moving website node:", nodeId, "to:", x, y);

    setWebsiteNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, [dragOffset]);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    console.log("🌐 Website node pointer up");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const forceResetDragState = useCallback(() => {
    console.log("🔄 Force resetting website node drag state");
    setDraggingNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    websiteNodes,
    draggingNodeId,
    addWebsiteNode,
    addWebsitesToNode,
    deleteWebsiteNode,
    deleteWebsite,
    handleNodePointerDown,
    moveWebsiteNode,
    handleNodePointerUp,
    forceResetDragState,
  };
};
