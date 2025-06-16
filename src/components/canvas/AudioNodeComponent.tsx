import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Trash2, FileText, Clock } from "lucide-react";
import { AudioNode, AudioRecording } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAudioRecording } from "@/hooks/useAudioRecording";

interface AudioNodeComponentProps {
  node: AudioNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  isConnected: boolean;
  onAddRecording: (nodeId: string, recording: AudioRecording) => void;
}

export const AudioNodeComponent: React.FC<AudioNodeComponentProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  isConnected,
  onAddRecording,
}) => {
  const { isDarkMode } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<AudioRecording | null>(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

  const { startRecording, stopRecording, isRecording: hookIsRecording } = useAudioRecording({
    onRecordingComplete: (blob, duration) => {
      const newRecording: AudioRecording = {
        id: uuidv4(),
        blob,
        duration,
        recordedAt: new Date().toISOString(),
      };
      onAddRecording(node.id, newRecording);
    }
  });

  useEffect(() => {
    setIsRecording(hookIsRecording);
  }, [hookIsRecording]);

  const handleStartRecording = () => {
    startRecording();
  };

  const handleStopRecording = async () => {
    stopRecording();
  };

  const handlePlayRecording = (recording: AudioRecording) => {
    setSelectedRecording(recording);
    const url = URL.createObjectURL(recording.blob);
    setAudioUrl(url);
  };

  const handleDeleteRecording = (recordingId: string) => {
    const updatedRecordings = node.recordings.filter(r => r.id !== recordingId);
    // Update the node with the new recordings array
    // setAudioNodes(prev => prev.map(n =>
    //   n.id === node.id ? { ...n, recordings: updatedRecordings } : n
    // ));
  };

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const recordedAt = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - recordedAt.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <>
      <div
        className={`absolute pointer-events-auto group`}
        style={{ 
          left: node.x, 
          top: node.y, 
          transform: 'translate(-50%, -50%)' 
        }}
        onPointerDown={(e) => onPointerDown(e, node.id)}
        data-node-id={node.id}
      >
        <Card className={`w-80 max-h-96 overflow-hidden transition-all duration-300 hover:shadow-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 border-zinc-700/50 shadow-xl shadow-amber-500/5' 
            : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-gray-200/50 shadow-xl shadow-amber-500/5'
        } backdrop-blur-md group-hover:scale-[1.02] border-2`}>
          <CardHeader className="pb-4 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${
              isDarkMode 
                ? 'from-amber-600/10 to-orange-600/10' 
                : 'from-amber-500/5 to-orange-500/5'
            }`} />
            <CardTitle className="flex items-center justify-between text-sm relative z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-amber-600/20' : 'bg-amber-500/10'
                } border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-500/20'}`}>
                  <Mic className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <span className="font-semibold">Audio</span>
                  <div className="flex items-center gap-1 mt-1">
                    {/* <Sparkles className="w-3 h-3 text-amber-500" /> */}
                    <span className="text-xs text-amber-500 font-medium">{node.recordings.length} recordings</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTranscriptModal(true);
                  }}
                  className="h-8 w-8 p-0 rounded-full text-blue-500 hover:text-blue-400 hover:bg-blue-500/20 transition-colors"
                  title="View transcript"
                >
                  <FileText className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node.id);
                  }}
                  className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete node"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-center">
              {isRecording ? (
                <Button 
                  variant="destructive" 
                  onClick={handleStopRecording}
                  className="animate-pulse"
                  disabled={!isRecording}
                >
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleStartRecording}
                  disabled={isRecording}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              )}
            </div>

            {node.recordings.map((recording) => (
              <div key={recording.id} className="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg group/item">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm truncate group-hover/item:text-amber-500 transition-colors" title={`Recording ${recording.recordedAt}`}>
                        Recording - {formatDuration(recording.duration)}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-zinc-600/50 text-zinc-300 border-zinc-500/30' 
                            : 'bg-gray-100/80 text-gray-600 border-gray-200/50'
                        } border`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(recording.recordedAt)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <audio controls src={URL.createObjectURL(recording.blob)} className="w-full">
                  Your browser does not support the audio element.
                </audio>

                <div className="flex items-center justify-between mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePlayRecording(recording)}
                    className="text-xs"
                  >
                    Play
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteRecording(recording.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            
            {node.recordings.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recordings yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Handle - positioned outside with transparent background */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
          className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-transparent transition-colors z-10"
          title="Create connection"
        >
          <div className="w-4 h-4 rounded-full border-2 border-amber-500 bg-transparent animate-pulse shadow-lg shadow-amber-500/30" />
        </Button>

        <style>
          {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? 'rgba(156, 163, 175, 0.5)' : 'rgba(107, 114, 128, 0.5)'};
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(107, 114, 128, 0.7)'};
          }
          `}
        </style>
      </div>

      {/* HTML Transcript Modal */}
      <Dialog open={showTranscriptModal} onOpenChange={setShowTranscriptModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Audio Recording Transcripts
            </DialogTitle>
            <DialogDescription>
              Transcripts from all audio recordings in this node
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {node.recordings.map((recording, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Mic className="w-4 h-4 text-amber-500" />
                    <h4 className="font-semibold text-sm">Recording - {formatDuration(recording.duration)}</h4>
                    <span className="text-xs text-muted-foreground">({getTimeAgo(recording.recordedAt)})</span>
                  </div>
                  <div className={`p-4 rounded-lg border font-mono text-xs leading-relaxed ${
                    isDarkMode 
                      ? 'bg-zinc-800/50 border-zinc-700' 
                      : 'bg-gray-50 border-gray-200'
                  } max-h-96 overflow-y-auto`}>
                    <pre className="whitespace-pre-wrap break-words">
                      {recording.transcript || 'No transcript available for this recording.'}
                    </pre>
                  </div>
                </div>
              ))}
              {node.recordings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No audio content available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
