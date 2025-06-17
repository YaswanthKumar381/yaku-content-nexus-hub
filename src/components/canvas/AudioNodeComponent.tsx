import React, { useState, useCallback, useRef, useEffect } from "react";
import { Trash2, Plus, Play, Pause, Mic, Square } from "lucide-react";
import { AudioNode, AudioRecording } from "@/types/canvas";
import { useTheme } from "@/contexts/ThemeContext";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { Button } from "@/components/ui/button";

interface AudioNodeProps {
  node: AudioNode;
  onPointerDown: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onAddRecordingToNode: (nodeId: string, recording: AudioRecording) => void;
  onDeleteRecording: (nodeId: string, recordingId: string) => void;
  isConnected: boolean;
}

export const AudioNodeComponent: React.FC<AudioNodeProps> = ({
  node,
  onPointerDown,
  onStartConnection,
  onDelete,
  onAddRecordingToNode,
  onDeleteRecording,
  isConnected,
}) => {
  const { isDarkMode } = useTheme();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording
  } = useAudioRecording();

  const handleStartRecording = useCallback(async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    try {
      const result = await stopRecording();
      if (result) {
        const newRecording: AudioRecording = {
          id: Date.now().toString(),
          blob: result.blob,
          duration: result.duration,
          recordedAt: new Date().toISOString(),
        };
        onAddRecordingToNode(node.id, newRecording);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }, [stopRecording, onAddRecordingToNode, node.id]);

  const handlePlayPause = useCallback((recording: AudioRecording) => {
    const audio = audioElements.get(recording.id);
  
    if (!audio) {
      const newAudio = new Audio(URL.createObjectURL(recording.blob));
      newAudio.onended = () => setCurrentlyPlaying(null);
      setAudioElements(prev => new Map(prev).set(recording.id, newAudio));
      newAudio.play();
      setCurrentlyPlaying(recording.id);
    } else {
      if (currentlyPlaying === recording.id) {
        audio.pause();
        setCurrentlyPlaying(null);
      } else {
        if (currentlyPlaying) {
          const currentlyPlayingAudio = audioElements.get(currentlyPlaying);
          currentlyPlayingAudio?.pause();
        }
        audio.play();
        setCurrentlyPlaying(recording.id);
      }
    }
  }, [audioElements, currentlyPlaying, setCurrentlyPlaying]);

  useEffect(() => {
    return () => {
      audioElements.forEach(audio => {
        audio.pause();
      });
    };
  }, [audioElements]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    onPointerDown(e, node.id);
  }, [onPointerDown, node.id]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`absolute pointer-events-auto group ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
      style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
      onPointerDown={handlePointerDown}
      data-node-id={node.id}
    >
      <div className={`w-80 ${
        isDarkMode 
          ? 'bg-zinc-800 border-zinc-700' 
          : 'bg-white border-gray-200'
      } border rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl group-hover:scale-[1.02]`}>
        
        {/* Header */}
        <div className={`p-4 border-b ${
          isDarkMode ? 'border-zinc-700' : 'border-gray-200'
        } flex items-center justify-between`}>
          <h3 className="font-semibold text-lg">Audio Recordings</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="h-8 w-8 text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Recording Controls */}
        <div className={`p-4 border-b ${
          isDarkMode ? 'border-zinc-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isRecording ? (
                <Button
                  onClick={handleStartRecording}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  size="sm"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={handleStopRecording}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  size="sm"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
            {isRecording && (
              <div className="text-sm text-red-500">
                {formatDuration(recordingDuration)}
              </div>
            )}
          </div>
        </div>

        {/* Recordings List */}
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {node.recordings.length === 0 ? (
            <div className={`text-center py-8 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recordings yet</p>
            </div>
          ) : (
            node.recordings.map((recording) => (
              <div key={recording.id} className={`p-3 rounded-lg border ${
                isDarkMode 
                  ? 'border-zinc-700 bg-zinc-700/50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(recording);
                      }}
                      className="h-8 w-8"
                    >
                      {currentlyPlaying === recording.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div>
                      <div className="text-sm font-medium">
                        {formatDuration(recording.duration)}
                      </div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(recording.recordedAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecording(node.id, recording.id);
                    }}
                    className="h-6 w-6 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {recording.transcript && (
                  <div className={`mt-2 p-2 rounded text-xs ${
                    isDarkMode 
                      ? 'bg-zinc-600/50 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {recording.transcript}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Connection Handle - Outside and Transparent */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onStartConnection(node.id);
          }}
          className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-transparent hover:bg-transparent transition-colors z-10"
          title="Create connection"
        >
          <div className="w-4 h-4 rounded-full border-2 border-violet-500 bg-transparent animate-pulse shadow-lg shadow-violet-500/30" />
        </Button>
      </div>
    </div>
  );
};
