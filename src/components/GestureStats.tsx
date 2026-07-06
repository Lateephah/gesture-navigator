import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gesture } from '@/hooks/useGestureDetection';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap } from 'lucide-react';

interface GestureStatsProps {
  gesture: Gesture;
  confidence: number;
  isEnabled: boolean;
}

const GESTURE_EMOJIS: Record<Gesture, string> = {
  up: '⬆️ Up',
  down: '⬇️ Down',
  left: '⬅️ Left',
  right: '➡️ Right',
  peace: '✌️ Peace',
  palm: '✋ Palm',
  none: '🔍 Searching...',
};

export const GestureStats: React.FC<GestureStatsProps> = ({ gesture, confidence, isEnabled }) => {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Card className="h-full border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Real-time Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4 bg-muted/50 rounded-xl border-2 border-dashed border-muted">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Detected Gesture</p>
          <h2 className="text-3xl font-bold text-primary">
            {!isEnabled ? 'System Idle' : GESTURE_EMOJIS[gesture]}
          </h2>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold">Confidence Score</span>
            </div>
            <span className="text-2xl font-bold tabular-nums">{isEnabled ? confidencePercent : 0}%</span>
          </div>
          <Progress value={isEnabled ? confidencePercent : 0} className="h-3" />
          <p className="text-[10px] text-muted-foreground text-center italic">
            Actions trigger at &gt;90% confidence
          </p>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-secondary/50 p-2 rounded-lg flex flex-col items-center">
              <span className="text-muted-foreground">Status</span>
              <span className={isEnabled ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                {isEnabled ? "ACTIVE" : "PAUSED"}
              </span>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg flex flex-col items-center">
              <span className="text-muted-foreground">Processing</span>
              <span className="font-bold">Real-time</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
