
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
      
      // Use the allorigins proxy service
      const encodedURL = encodeURIComponent(url);
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodedURL}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      console.log(`✅ Successfully fetched content for: ${url}`);
      
      // Extract title from the HTML content
      const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;
      
      // Extract meta description
      const descMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      const metaDescription = descMatch ? descMatch[1] : '';
      
      // Remove HTML tags and get text content
      let textContent = htmlContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Prioritize meta description, then first paragraph of content
      const finalContent = metaDescription || textContent.substring(0, 2000);
      
      return {
        url,
        title,
        content: finalContent,
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
    
    // Fetch content for all URLs
    const websiteDataPromises = urls.map(url => fetchWebsiteContent(url));
    const websites = await Promise.all(websiteDataPromises);
    
    const newNode: WebsiteNode = {
      id: nodeId,
      x,
      y,
      type: 'website',
      websites,
    };

    setWebsiteNodes(prev => [...prev, newNode]);
    console.log("✅ Website node created:", newNode);
    return newNode;
  }, []);

  const addWebsitesToNode = useCallback(async (nodeId: string, urls: string[]): Promise<void> => {
    const websiteDataPromises = urls.map(url => fetchWebsiteContent(url));
    const newWebsites = await Promise.all(websiteDataPromises);
    
    setWebsiteNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, websites: [...node.websites, ...newWebsites] }
        : node
    ));
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
    e.stopPropagation();
    const node = websiteNodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
    console.log("🌐 Started dragging website node:", nodeId);
  }, [websiteNodes]);

  const moveWebsiteNode = useCallback((nodeId: string, clientX: number, clientY: number, transform: Transform) => {
    const rect = document.querySelector('[data-canvas-container]')?.getBoundingClientRect();
    if (!rect) return;

    const x = (clientX - rect.left - transform.x - dragOffset.x) / transform.scale;
    const y = (clientY - rect.top - transform.y - dragOffset.y) / transform.scale;

    setWebsiteNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, x, y } : node
    ));
  }, [dragOffset]);

  const handleNodePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggingNodeId) {
      console.log("🌐 Stopped dragging website node:", draggingNodeId);
      setDraggingNodeId(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [draggingNodeId]);

  const forceResetDragState = useCallback(() => {
    console.log("🔄 Resetting website node drag state");
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
