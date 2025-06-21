import { useState, useRef, useCallback, useEffect } from 'react';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const load = useCallback(async (audioUrl: string) => {
    console.log('🎧 Loading audio URL:', audioUrl);
    setIsLoading(true);
    setError(null);
    setCurrentTime(0);
    setDuration(0);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      const audio = new Audio();
      audio.preload = 'metadata';

      if (audioUrl.startsWith('blob:')) {
        blobUrlRef.current = audioUrl;
      }

      const handleLoadedMetadata = () => {
        console.log('✅ Metadata loaded, duration:', audio.duration);
        setDuration(audio.duration || 0);
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        console.log('🛑 Playback ended');
        setIsPlaying(false);
        setCurrentTime(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };

      const handleError = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        console.error('❌ Audio error:', target.error);

        let errorMessage = 'Failed to load audio file';
        if (target.error) {
          switch (target.error.code) {
            case 1: errorMessage = 'Loading aborted'; break;
            case 2: errorMessage = 'Network error'; break;
            case 3: errorMessage = 'Decoding error - unsupported format'; break;
            case 4: errorMessage = 'Source format not supported'; break;
            default: errorMessage = 'Unknown playback error';
          }
        }

        setError(errorMessage);
        setIsLoading(false);
      };

      const handleCanPlay = () => {
        console.log('🎶 Audio can play now');
      };

      // Attach listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('canplay', handleCanPlay);

      audioRef.current = audio;
      audio.src = audioUrl;
      audio.load();

      console.log('▶️ Audio initialized');
    } catch (err) {
      console.error('⚠️ Load failed:', err);
      setError('Could not load audio');
      setIsLoading(false);
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current || isLoading) {
      console.warn('⏸ Cannot play: loading or audio not set');
      return;
    }

    try {
      if (audioRef.current.readyState < 2) {
        console.log('⏳ Waiting for audio to load...');

        return await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout while loading audio'));
          }, 10000);

          const onCanPlay = () => {
            clearTimeout(timeout);
            cleanup();
            audioRef.current?.play()
              .then(() => {
                console.log('✅ Audio started');
                setIsPlaying(true);
                setError(null);
                startTimeTracking();
                resolve();
              })
              .catch(err => {
                console.error('❌ Autoplay error:', err);
                setError('Playback blocked by browser (autoplay policy?)');
                reject(err);
              });
          };

          const onError = () => {
            clearTimeout(timeout);
            cleanup();
            reject(new Error('Audio failed to load'));
          };

          const cleanup = () => {
            audioRef.current?.removeEventListener('canplaythrough', onCanPlay);
            audioRef.current?.removeEventListener('error', onError);
          };

          audioRef.current?.addEventListener('canplaythrough', onCanPlay);
          audioRef.current?.addEventListener('error', onError);
        });
      }

      await audioRef.current.play();
      console.log('✅ Playing');
      setIsPlaying(true);
      setError(null);
      startTimeTracking();
    } catch (err) {
      console.error('❌ Play failed:', err);
      setError('Playback failed - format or browser issue');
      setIsPlaying(false);
    }
  }, [isLoading]);

  const startTimeTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 100);
  };

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && duration > 0) {
      const clamped = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  }, [duration]);

  return {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    error,
    load,
    play,
    pause,
    stop,
    seek,
  };
};
