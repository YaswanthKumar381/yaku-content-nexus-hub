
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  NodeToolbar,
  NodeResizer,
  Background,
  ControlButton,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Youtube, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useHotkeys } from 'react-hotkeys-hook';
import { nanoid } from 'nanoid'
import { YoutubeTranscript } from 'youtube-transcript';

const generateId = () => nanoid(8);

const extractVideoId = (url: string): string | undefined => {
  const regex = /[?&]v=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : undefined;
};

interface NodeData {
  label: string;
  context: string;
  url?: string;
  thumbnail?: string;
  title?: string;
}

type NodeType = 'text' | 'video';

interface BaseNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

interface TextNode extends BaseNode {
  type: 'text';
}

interface VideoNode extends BaseNode {
  type: 'video';
  data: {
    label: string;
    url: string;
    thumbnail: string;
    title: string;
    context: string;
  };
}

type Node = TextNode | VideoNode;

// Custom Context Menu Component
const CustomContextMenu = ({ 
  isOpen, 
  onClose, 
  position, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  position: { x: number; y: number }; 
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div 
        className="fixed z-50 bg-white border rounded-md shadow-lg p-2 min-w-48"
        style={{ 
          left: position.x, 
          top: position.y 
        }}
      >
        {children}
      </div>
    </>
  );
};

const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [newTextNodePosition, setNewTextNodePosition] = useState<{ x: number; y: number } | null>(null);
  const [newVideoNodePosition, setNewVideoNodePosition] = useState<{ x: number; y: number } | null>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState<string | null>(null);
  const [newTextNodeLabel, setNewTextNodeLabel] = useState("New Text");
  const [newTextNodeContext, setNewTextNodeContext] = useState("");
  const [newVideoNodeUrl, setNewVideoNodeUrl] = useState("");
	const { toast } = useToast()

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleContextMenu = (event: React.MouseEvent, node?: any) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setIsContextMenuOpen(true);
    setContextMenuTarget(node ? node.id : null);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
    setContextMenuTarget(null);
  };

  const handleCanvasContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setIsContextMenuOpen(true);
    setContextMenuTarget(null); // Clear any existing target
    setNewTextNodePosition({ x: event.clientX, y: event.clientY });
    setNewVideoNodePosition({ x: event.clientX, y: event.clientY });
  };

  const addTextNode = () => {
    if (newTextNodePosition) {
      const newNode: TextNode = {
        id: generateId(),
        type: 'text',
        position: { x: newTextNodePosition.x, y: newTextNodePosition.y },
        data: { label: newTextNodeLabel, context: newTextNodeContext },
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
      setNewTextNodePosition(null);
      closeContextMenu();
			toast({
				title: "Text Node Created",
				description: "Your new text node has been successfully created.",
			})
    }
  };

  const addVideoNode = async (url: string) => {
    try {
      console.log('🎬 Creating video node for:', url);
      
      // Extract video ID from URL for thumbnail
      const videoId = extractVideoId(url);
      if (!videoId) {
        console.error('❌ Invalid YouTube URL');
        return;
      }

      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Create the video node first
      const newNode: VideoNode = {
        id: generateId(),
        type: 'video',
        position: { x: 100, y: 100 },
        data: {
          label: `Video: ${videoId}`,
          url,
          thumbnail: thumbnailUrl,
          title: `Video: ${videoId}`,
          context: 'Loading transcript...' // Placeholder while fetching
        }
      };

      // Add node to the canvas immediately
      setNodes(prevNodes => [...prevNodes, newNode]);
      console.log('✅ Video node created:', newNode.id);

      // Fetch transcript in the background
      try {
        const transcript = await fetchTranscript(url);
        
        // Update the node with the transcript
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === newNode.id 
              ? { ...node, data: { ...node.data, context: transcript } }
              : node
          )
        );
        console.log('✅ Transcript added to node context');
      } catch (transcriptError) {
        console.error('❌ Failed to fetch transcript, but node created:', transcriptError);
        // Update node with error message
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === newNode.id 
              ? { ...node, data: { ...node.data, context: 'Transcript unavailable for this video' } }
              : node
          )
        );
      }
      
    } catch (error) {
      console.error('❌ Failed to create video node:', error);
    }
  };

  const deleteNode = () => {
    if (contextMenuTarget) {
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== contextMenuTarget));
      setEdges((prevEdges) => prevEdges.filter(edge => edge.source !== contextMenuTarget && edge.target !== contextMenuTarget));
      closeContextMenu();
			toast({
				title: "Node Deleted",
				description: "The selected node has been successfully deleted.",
			})
    }
  };

  const handleTextNodeLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTextNodeLabel(event.target.value);
  };

  const handleTextNodeContextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTextNodeContext(event.target.value);
  };

  const handleVideoNodeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewVideoNodeUrl(event.target.value);
  };

  const fetchTranscript = async (videoUrl: string): Promise<string> => {
    try {
      console.log('🎬 Fetching transcript for:', videoUrl);
      
      const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
      console.log('📝 Raw transcript data:', transcript);
      
      // Convert transcript segments to readable text
      const transcriptText = transcript
        .map(segment => segment.text)
        .join(' ')
        .replace(/\n/g, ' ')
        .trim();
      
      console.log('✅ Processed transcript:', transcriptText.substring(0, 200) + '...');
      return transcriptText;
    } catch (error) {
      console.error('💥 Error fetching transcript:', error);
      throw new Error(`Failed to fetch transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const TextNodeComponent = ({ data }: { data: NodeData }) => {
    return (
      <div className="bg-zinc-800 rounded-md p-4 text-white shadow-md w-64">
        <div>{data.label}</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2">
              <FileText className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ScrollArea className="h-72">
              <div className="text-sm opacity-70">{data.context}</div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const VideoNodeComponent = ({ data }: { data: VideoNode['data'] }) => {
    return (
      <div className="bg-zinc-800 rounded-md text-white shadow-md w-80">
        <img src={data.thumbnail} alt={data.title} className="rounded-t-md" />
        <div className="p-4">
          <h3 className="font-semibold mb-2">{data.title}</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                <FileText className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <ScrollArea className="h-96">
                <div className="text-sm opacity-70">{data.context}</div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-zinc-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleContextMenu}
        onPaneContextMenu={handleCanvasContextMenu}
				onNodeDoubleClick={handleContextMenu}
        nodeTypes={{
          text: TextNodeComponent,
          video: VideoNodeComponent,
        }}
        fitView
        className="bg-zinc-800"
      >
        <Controls />
        <Background color="#444" variant="dots" />
      </ReactFlow>

      <CustomContextMenu
        isOpen={isContextMenuOpen}
        onClose={closeContextMenu}
        position={contextMenuPosition}
      >
        {contextMenuTarget === null ? (
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => {
                addTextNode();
                closeContextMenu();
              }}
            >
              Add Text Node
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  Add Video Node
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add YouTube Video</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the YouTube video URL to add a video node.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="url">Video URL</Label>
                  <Input
                    id="url"
                    placeholder="YouTube Video URL"
                    onChange={handleVideoNodeUrlChange}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    addVideoNode(newVideoNodeUrl);
                    closeContextMenu();
                  }}>Add</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive"
            onClick={() => {
              deleteNode();
              closeContextMenu();
            }}
          >
            Delete Node
          </Button>
        )}
      </CustomContextMenu>

      {/* Text Node Creation Modal */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="absolute top-4 left-4 z-10">Add Text Node</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Text Node</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the label and context for the new text node.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Label
              </Label>
              <Input
                type="text"
                id="label"
                value={newTextNodeLabel}
                onChange={handleTextNodeLabelChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="context" className="text-right">
                Context
              </Label>
              <Textarea
                id="context"
                value={newTextNodeContext}
                onChange={handleTextNodeContextChange}
                className="col-span-3"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              addTextNode();
            }}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Canvas;
