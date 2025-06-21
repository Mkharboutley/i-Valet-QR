import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { downloadVoiceFile } from '../../services/storage';
import { getRelativeTime } from '../../utils/time';

interface AudioPlayerWithVisualizerProps {
  storagePath: string;
  timestamp: number;
  isOwnMessage: boolean;
  sender: 'client' | 'admin';
  currentUserRole?: 'client' | 'admin';
}

const AudioPlayerWithVisualizer: React.FC<AudioPlayerWithVisualizerProps> = ({
  storagePath,
  timestamp,
  isOwnMessage,
  sender,
  currentUserRole = 'admin'
}) => {
  const { isPlaying, isLoading, currentTime, duration, error, play, pause, load } = useAudioPlayer();
  const [waveformBars] = useState<number[]>(() => 
    // Create realistic waveform pattern
    Array.from({ length: 30 }, (_, i) => {
      const baseHeight = 0.2 + Math.sin(i * 0.3) * 0.15;
      const randomVariation = Math.random() * 0.3;
      return Math.min(0.8, Math.max(0.15, baseHeight + randomVariation));
    })
  );
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const barWidth = 2;
    const gap = 1;
    const totalBarWidth = barWidth + gap;
    const visibleBars = Math.min(Math.floor(width / totalBarWidth), waveformBars.length);
    
    // Calculate progress - only show progress when actually playing and duration is known
    let progress = 0;
    if (duration > 0 && (isPlaying || currentTime > 0)) {
      progress = Math.min(currentTime / duration, 1);
    }

    for (let i = 0; i < visibleBars; i++) {
      const barHeight = waveformBars[i] * height * 0.7;
      const x = i * totalBarWidth;
      const y = (height - barHeight) / 2;
      
      // Determine if this bar should be "played"
      const barProgress = i / visibleBars;
      const isPlayed = barProgress <= progress;
      
      // WhatsApp-like styling
      ctx.fillStyle = isPlayed ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
      
      // Draw rounded bars
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      ctx.fill();
    }
  }, [waveformBars, currentTime, duration, isPlaying]);

  // Animation loop for smooth waveform updates
  useEffect(() => {
    const animate = () => {
      drawWaveform();
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    } else {
      drawWaveform();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform, isPlaying]);

  const handlePlayPause = useCallback(async () => {
    try {
      setLoadingError(null);
      
      if (isPlaying) {
        pause();
      } else {
        if (!audioLoaded) {
          console.log('Loading audio from:', storagePath);
          const audioUrl = await downloadVoiceFile(storagePath);
          await load(audioUrl);
          setAudioLoaded(true);
        }
        await play();
      }
    } catch (error) {
      console.error('Error with audio:', error);
      setLoadingError('Failed to load audio');
    }
  }, [isPlaying, audioLoaded, storagePath, load, play, pause]);

  const messageTime = new Date(timestamp);
  
  // Message styling based on sender
  const isAdminMessage = sender === 'admin';
  const bubbleColor = isAdminMessage ? 'bg-blue-500' : 'bg-green-500';
  const alignment = isAdminMessage ? 'justify-end' : 'justify-start';
  const marginClass = isAdminMessage ? 'ml-12' : 'mr-12';

  return (
    <div className={`flex ${alignment} mb-3 w-full`}>
      <div className={`max-w-[200px] ${marginClass}`}>
        {/* Sender Label */}
        <div className={`text-xs mb-1 ${isAdminMessage ? 'text-right' : 'text-left'} text-white/60`}>
          {isAdminMessage ? 'Admin' : 'Client'}
        </div>
        
        {/* Audio Player Bubble - Reduced height */}
        <div className={`${bubbleColor} rounded-2xl px-2 py-1.5 flex items-center gap-2 shadow-lg`}>
          {/* Play/Pause Button - Smaller */}
          <Button
            onClick={handlePlayPause}
            variant="ghost"
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white flex-shrink-0 rounded-full h-6 w-6 p-0 border-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (error || loadingError) ? (
              <AlertCircle className="h-3 w-3" />
            ) : isPlaying ? (
              <Pause className="h-3 w-3 fill-white" />
            ) : (
              <Play className="h-3 w-3 fill-white ml-0.5" />
            )}
          </Button>

          {/* Waveform Only - Smaller */}
          <div className="flex-1 min-w-0">
            {(error || loadingError) ? (
              <div className="text-xs text-white/80 text-center py-1">
                Audio Error
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={100}
                height={16}
                className="w-full h-4"
              />
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-1 ${
          isAdminMessage ? 'text-right' : 'text-left'
        } text-white/40`}>
          {getRelativeTime(messageTime)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerWithVisualizer;