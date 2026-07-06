import React from 'react';
import { Camera, CameraOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WebcamCardProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: string | null;
  isEnabled: boolean;
}

export const WebcamCard: React.FC<WebcamCardProps> = ({ videoRef, isLoading, error, isEnabled }) => {
  return (
    <Card className="overflow-hidden border-2 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isEnabled ? <Camera className="w-5 h-5 text-primary" /> : <CameraOff className="w-5 h-5 text-muted-foreground" />}
          Live Camera Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative aspect-video bg-muted flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground font-medium">Starting camera...</p>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-destructive/10 p-6 text-center">
            <CameraOff className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-semibold">{error}</p>
          </div>
        )}

        {!isEnabled && !error && !isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-muted">
            <CameraOff className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">Gesture Control Paused</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "w-full h-full object-cover mirror",
            (!isEnabled || isLoading || error) && "opacity-20 grayscale"
          )}
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {isEnabled && !isLoading && !error && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-background/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
