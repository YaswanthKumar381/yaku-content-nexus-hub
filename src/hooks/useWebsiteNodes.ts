
import { useState, useCallback } from "react";
import { WebsiteNode, WebsiteData } from "@/types/canvas";
import { v4 as uuidv4 } from 'uuid';

export const useWebsiteNodes = () => {
  const [websiteNodes, setWebsiteNodes] = useState<WebsiteNode[]>([]);

  const fetchWebsiteContent = async (url: string): Promise<WebsiteData> => {
    try {
      // For now, we'll simulate website scraping
      // In a real implementation, you'd need a backend service or API
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      // Extract title from the HTML content
      const titleMatch = data.contents.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : url;
      
      // Remove HTML tags and get text content
      const textContent = data.contents.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      return {
        url,
        title,
        content: textContent.substring(0, 5000), // Limit content length
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching website content:', error);
      return {
        url,
        title: url,
        content: `Failed to fetch content from ${url}`,
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

  return {
    websiteNodes,
    addWebsiteNode,
    addWebsitesToNode,
    deleteWebsiteNode,
    deleteWebsite,
  };
};
