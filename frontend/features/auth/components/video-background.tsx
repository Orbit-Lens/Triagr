'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  src?: string;
  playbackSpeed?: number;
}

const DEFAULT_VIDEO_SRC =
  'https://res.cloudinary.com/zby2cx5x/video/upload/v1792345739/drone_sign_image_m8z82j.mp4';

export function VideoBackground({
  src = DEFAULT_VIDEO_SRC,
  playbackSpeed = 0.85,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoopFading, setIsLoopFading] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      setIsVideoLoaded(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const remainingTime = video.duration - video.currentTime;
    // Trigger smooth fade 0.75s before the end of the video
    if (remainingTime <= 0.75 && !isLoopFading) {
      setIsLoopFading(true);
    } else if (video.currentTime < 0.75 && isLoopFading) {
      // Loop restarted, smoothly fade back in
      setIsLoopFading(false);
    }
  };

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black select-none pointer-events-none">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
          }
        }}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out',
          isVideoLoaded ? 'opacity-80' : 'opacity-0'
        )}
      />

      {/* Smooth Loop Transition Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black transition-opacity duration-700 ease-in-out',
          isLoopFading ? 'opacity-90' : 'opacity-0'
        )}
      />

      {/* Cinematic Ops Vignette & Readability Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />
    </div>
  );
}
